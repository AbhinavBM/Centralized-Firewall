const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Endpoint = require('./mongodb-backend/src/models/Endpoint');

const BASE_URL = 'http://localhost:5000/api';

async function debugEndpointAuth() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/centralized-firewall');
    console.log('✅ Connected to MongoDB');

    // 1. Check all existing endpoints
    console.log('\n🔍 Checking all existing endpoints...');
    const allEndpoints = await Endpoint.find({}).select('hostname ipAddress status createdAt');
    
    if (allEndpoints.length > 0) {
      console.log('📋 Found existing endpoints:');
      allEndpoints.forEach((endpoint, index) => {
        console.log(`   ${index + 1}. Hostname: "${endpoint.hostname}" | IP: ${endpoint.ipAddress} | Status: ${endpoint.status}`);
      });
    } else {
      console.log('❌ No endpoints found in database');
    }

    // 2. Check for specific hostnames
    console.log('\n🔍 Checking for specific hostnames...');
    const serverVariations = ['server-01', 'SERVER 01', 'Server-01', 'server_01'];
    
    for (const hostname of serverVariations) {
      const endpoint = await Endpoint.findOne({ hostname });
      if (endpoint) {
        console.log(`✅ Found endpoint with hostname: "${hostname}" (ID: ${endpoint._id})`);
      } else {
        console.log(`❌ No endpoint found with hostname: "${hostname}"`);
      }
    }

    // 3. Create endpoint with the exact hostname you're using
    console.log('\n🔧 Creating endpoint with hostname "server-01"...');
    
    // Delete existing endpoint with this hostname if it exists
    await Endpoint.deleteOne({ hostname: 'server-01' });
    
    const newEndpoint = new Endpoint({
      hostname: 'server-01',  // Exact match for your request
      ipAddress: '192.168.1.101',
      os: 'Windows Server 2022',
      status: 'pending',
      password: 'Abhi@1234'  // This will be hashed automatically
    });
    
    await newEndpoint.save();
    console.log('✅ Endpoint created successfully');
    console.log(`   - ID: ${newEndpoint._id}`);
    console.log(`   - Hostname: "${newEndpoint.hostname}"`);
    console.log(`   - Password (hashed): ${newEndpoint.password}`);

    // 4. Test authentication with your exact payload
    console.log('\n🔐 Testing authentication with your exact payload...');
    
    const authPayload = {
      endpoint_name: 'server-01',  // Exact match
      password: 'Abhi@1234'
    };

    try {
      console.log(`Making request to: ${BASE_URL}/endpoints/authenticate`);
      console.log('Payload:', JSON.stringify(authPayload, null, 2));
      
      const response = await axios.post(`${BASE_URL}/endpoints/authenticate`, authPayload);
      console.log('✅ Authentication successful!');
      console.log('Response:', response.data);
    } catch (error) {
      console.log('❌ Authentication failed!');
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log('Response:', error.response.data);
        console.log('Headers:', error.response.headers);
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error:', error.message);
      }
    }

    // 5. Test with wrong password to verify error handling
    console.log('\n🔐 Testing with wrong password...');
    
    const wrongAuthPayload = {
      endpoint_name: 'server-01',
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

    // 6. Verify the endpoint was updated to online status
    console.log('\n🔍 Checking endpoint status after authentication...');
    const updatedEndpoint = await Endpoint.findOne({ hostname: 'server-01' });
    if (updatedEndpoint) {
      console.log(`✅ Endpoint status: ${updatedEndpoint.status}`);
      console.log(`✅ Last heartbeat: ${updatedEndpoint.lastHeartbeat}`);
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the debug
console.log('🚀 Starting endpoint authentication debug...');
debugEndpointAuth();
