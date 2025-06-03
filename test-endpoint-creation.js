const axios = require('axios');

// Test endpoint creation
async function testEndpointCreation() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('🔍 Testing Endpoint Creation...\n');
    
    // Step 1: Test server health
    console.log('1. Testing server health...');
    try {
      const healthResponse = await axios.get(`${baseURL.replace('/api', '')}/health`);
      console.log('✅ Server is running:', healthResponse.data);
    } catch (error) {
      console.log('❌ Server health check failed:', error.message);
      return;
    }
    
    // Step 2: Test authentication (login first)
    console.log('\n2. Testing authentication...');
    let authToken = null;
    try {
      const loginResponse = await axios.post(`${baseURL}/auth/login`, {
        username: 'admin',
        password: 'admin123'
      });
      authToken = loginResponse.data.token;
      console.log('✅ Authentication successful');
    } catch (error) {
      console.log('❌ Authentication failed:', error.response?.data || error.message);
      console.log('   Make sure you have a user with username: admin, password: admin123');
      return;
    }
    
    // Step 3: Test endpoint creation
    console.log('\n3. Testing endpoint creation...');
    const endpointData = {
      hostname: 'test-endpoint-' + Date.now(),
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 254 + 1),
      os: 'Windows 10',
      status: 'pending',
      password: 'testpassword123'
    };
    
    console.log('   Endpoint data:', endpointData);
    
    try {
      const createResponse = await axios.post(`${baseURL}/endpoints`, endpointData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Endpoint created successfully:', createResponse.data);
      
      // Step 4: Verify endpoint was created
      console.log('\n4. Verifying endpoint creation...');
      const listResponse = await axios.get(`${baseURL}/endpoints`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const createdEndpoint = listResponse.data.data.find(ep => ep.hostname === endpointData.hostname);
      if (createdEndpoint) {
        console.log('✅ Endpoint found in list:', {
          id: createdEndpoint._id,
          hostname: createdEndpoint.hostname,
          ipAddress: createdEndpoint.ipAddress,
          status: createdEndpoint.status
        });
      } else {
        console.log('❌ Endpoint not found in list');
      }
      
    } catch (error) {
      console.log('❌ Endpoint creation failed:');
      console.log('   Status:', error.response?.status);
      console.log('   Error:', error.response?.data || error.message);
      
      // Additional debugging
      if (error.response?.status === 400) {
        console.log('\n🔍 Validation Error Details:');
        console.log('   This usually means required fields are missing or invalid');
        console.log('   Required fields: hostname, ipAddress');
        console.log('   Optional fields: os, status, password');
      } else if (error.response?.status === 401) {
        console.log('\n🔍 Authentication Error:');
        console.log('   Token might be invalid or expired');
        console.log('   Make sure the JWT_SECRET is set correctly');
      } else if (error.response?.status === 500) {
        console.log('\n🔍 Server Error:');
        console.log('   Check server logs for detailed error information');
        console.log('   Common causes: Database connection, validation middleware, model issues');
      }
    }
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

// Run the test
testEndpointCreation();
