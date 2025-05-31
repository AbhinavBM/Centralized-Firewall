const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log('🔐 Testing endpoint authentication...');
  
  const authPayload = {
    endpoint_name: 'server-01',
    password: 'Abhi@1234'
  };

  try {
    console.log(`Making request to: ${BASE_URL}/endpoints/authenticate`);
    console.log('Payload:', JSON.stringify(authPayload, null, 2));
    
    const response = await axios.post(`${BASE_URL}/endpoints/authenticate`, authPayload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Authentication successful!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Authentication failed!');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else if (error.request) {
      console.log('No response received. Server might be down.');
      console.log('Request config:', error.config);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testAuth();
