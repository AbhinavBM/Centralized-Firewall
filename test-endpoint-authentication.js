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
    const existingEndpoint = await Endpoint.findOne({ hostname: 'RitvikBaby' }).select('+password');
    
    if (existingEndpoint) {
      console.log('✅ Found existing endpoint:');
      console.log(`   - ID: ${existingEndpoint._id}`);
      console.log(`   - Hostname: ${existingEndpoint.hostname}`);
      console.log(`   - IP: ${existingEndpoint.ipAddress}`);
      console.log(`   - Status: ${existingEndpoint.status}`);
      console.log(`   - Password: ${existingEndpoint.password}`);
    } else {
      console.log('❌ No endpoint found with hostname "RitvikBaby"');
      
      // Create the endpoint
      console.log('\n🔧 Creating endpoint...');
      const newEndpoint = new Endpoint({
        hostname: 'RitvikBaby',
        ipAddress: '192.168.1.100',
        os: 'Windows 11',
        status: 'pending',
        password: 'Ritvik@1234'
      });
      
      await newEndpoint.save();
      console.log('✅ Endpoint created successfully');
      console.log(`   - ID: ${newEndpoint._id}`);
      console.log(`   - Hostname: ${newEndpoint.hostname}`);
      console.log(`   - Password: ${newEndpoint.password}`);
    }

    // 2. Test authentication endpoint
    console.log('\n🔐 Testing authentication...');
    
    const authPayload = {
      endpoint_name: 'RitvikBaby',
      password: 'Ritvik@1234'
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

    // 3. Test with wrong password
    console.log('\n🔐 Testing with wrong password...');
    
    const wrongAuthPayload = {
      endpoint_name: 'RitvikBaby',
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

    // 4. Test with non-existent endpoint
    console.log('\n🔐 Testing with non-existent endpoint...');
    
    const nonExistentPayload = {
      endpoint_name: 'NonExistentEndpoint',
      password: 'SomePassword'
    };

    try {
      const response = await axios.post(`${BASE_URL}/endpoints/authenticate`, nonExistentPayload);
      console.log('❌ This should have failed!');
      console.log('Response:', response.data);
    } catch (error) {
      console.log('✅ Correctly rejected non-existent endpoint');
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log('Response:', error.response.data);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the test
testEndpointAuthentication();
