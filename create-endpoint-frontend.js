const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function createEndpointViaFrontend() {
  try {
    console.log('🚀 Creating endpoint via frontend API...');

    // 1. First, login to get JWT token
    console.log('\n🔐 Logging in to get JWT token...');
    
    const loginPayload = {
      username: 'admin',  // Default admin user
      password: 'admin123'  // Default admin password
    };

    let authToken;
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginPayload);
      authToken = loginResponse.data.token;
      console.log('✅ Login successful');
      console.log(`Token: ${authToken.substring(0, 20)}...`);
    } catch (error) {
      console.log('❌ Login failed. Creating admin user first...');
      
      // Try to register admin user
      const registerPayload = {
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      };
      
      try {
        await axios.post(`${BASE_URL}/auth/register`, registerPayload);
        console.log('✅ Admin user created');
        
        // Now login
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginPayload);
        authToken = loginResponse.data.token;
        console.log('✅ Login successful after registration');
      } catch (regError) {
        console.log('❌ Failed to create admin user:', regError.response?.data || regError.message);
        return;
      }
    }

    // 2. Create endpoint via frontend API
    console.log('\n🔧 Creating endpoint via frontend API...');
    
    const endpointPayload = {
      hostname: 'SERVER 01',
      ipAddress: '192.168.1.101',
      os: 'Windows Server 2022',
      status: 'pending',
      password: 'Abhi@1234'  // This will be hashed by the model
    };

    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.post(`${BASE_URL}/endpoints`, endpointPayload, { headers });
      console.log('✅ Endpoint created successfully via frontend API!');
      console.log('Response:', response.data);
      
      const endpointId = response.data.data._id;
      console.log(`📝 Endpoint ID: ${endpointId}`);
      
      return endpointId;
    } catch (error) {
      console.log('❌ Failed to create endpoint via frontend API');
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log('Response:', error.response.data);
      } else {
        console.log('Error:', error.message);
      }
    }

    // 3. Test NGFW authentication
    console.log('\n🔐 Testing NGFW authentication...');
    
    const authPayload = {
      endpoint_name: 'SERVER 01',
      password: 'Abhi@1234'
    };

    try {
      const response = await axios.post(`${BASE_URL}/endpoints/authenticate`, authPayload);
      console.log('✅ NGFW Authentication successful!');
      console.log('Response:', response.data);
    } catch (error) {
      console.log('❌ NGFW Authentication failed!');
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log('Response:', error.response.data);
      } else {
        console.log('Error:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Process failed:', error.message);
  }
}

// Run the process
createEndpointViaFrontend();
