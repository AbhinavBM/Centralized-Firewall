const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Endpoint = require('./mongodb-backend/src/models/Endpoint');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpointAuthentication() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/centralized-firewall');
    console.log('✅ Connected to MongoDB');

    // 1. Check if endpoint exists
    console.log('\n🔍 Checking for existing endpoint...');
    const existingEndpoint = await Endpoint.findOne({ hostname: 'SERVER 01' }).select('+password');
    
    if (existingEndpoint) {
      console.log('✅ Found existing endpoint:');
      console.log(`   - ID: ${existingEndpoint._id}`);
      console.log(`   - Hostname: ${existingEndpoint.hostname}`);
      console.log(`   - IP: ${existingEndpoint.ipAddress}`);
      console.log(`   - Status: ${existingEndpoint.status}`);
      console.log(`   - Password (hashed): ${existingEndpoint.password}`);
      
      // Delete existing endpoint to test fresh creation
      console.log('\n🗑️ Deleting existing endpoint to test fresh creation...');
      await Endpoint.deleteOne({ hostname: 'SERVER 01' });
      console.log('✅ Existing endpoint deleted');
    } else {
      console.log('❌ No endpoint found with hostname "SERVER 01"');
    }
    
    // 2. Create the endpoint (this will trigger password hashing)
    console.log('\n🔧 Creating endpoint with hashed password...');
    const newEndpoint = new Endpoint({
      hostname: 'SERVER 01',
      ipAddress: '192.168.1.101',
      os: 'Windows Server 2022',
      status: 'pending',
      password: 'Abhi@1234'  // This will be hashed automatically
    });
    
    await newEndpoint.save();
    console.log('✅ Endpoint created successfully');
    console.log(`   - ID: ${newEndpoint._id}`);
    console.log(`   - Hostname: ${newEndpoint.hostname}`);
    console.log(`   - Password (hashed): ${newEndpoint.password}`);

    // 3. Test authentication endpoint with correct password
    console.log('\n🔐 Testing authentication with correct password...');
    
    const authPayload = {
      endpoint_name: 'SERVER 01',
      password: 'Abhi@1234'
    };

    try {
      const response = await axios.post(`${BASE_URL}/endpoints/authenticate`, authPayload);
      console.log('✅ Authentication successful!');
      console.log('Response:', response.data);
    } catch (error) {
      console.log('❌ Authentication failed!');
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log('Response:', error.response.data);
      } else {
        console.log('Error:', error.message);
      }
    }

    // 4. Test with wrong password
    console.log('\n🔐 Testing with wrong password...');
    
    const wrongAuthPayload = {
      endpoint_name: 'SERVER 01',
      password: 'WrongPassword'
    };

    try {
      const response = await axios.post(`${BASE_URL}/endpoints/authenticate`, wrongAuthPayload);
      console.log('❌ This should have failed!');
      console.log('Response:', response.data);
    } catch (error) {
      console.log('✅ Correctly rejected wrong password');
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log('Response:', error.response.data);
      }
    }

    // 5. Test password comparison directly
    console.log('\n🔐 Testing password comparison method directly...');
    const savedEndpoint = await Endpoint.findOne({ hostname: 'SERVER 01' }).select('+password');
    if (savedEndpoint) {
      const isCorrectPassword = await savedEndpoint.comparePassword('Abhi@1234');
      const isWrongPassword = await savedEndpoint.comparePassword('WrongPassword');
      
      console.log(`✅ Correct password check: ${isCorrectPassword}`);
      console.log(`✅ Wrong password check: ${isWrongPassword}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the test
console.log('🚀 Starting endpoint authentication test with hashed passwords...');
testEndpointAuthentication();
