const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test credentials
const TEST_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

async function testFirewallFrontendAPI() {
  try {
    console.log('🔥 Testing Frontend Firewall API...\n');

    // 1. Login to get token
    console.log('1. 🔐 Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, TEST_CREDENTIALS);
    const token = loginResponse.data.token;
    console.log('✅ Login successful!');

    // Set up headers with token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2. Test GET all firewall rules (frontend endpoint)
    console.log('\n2. 📋 Testing GET all firewall rules (frontend)...');
    try {
      const rulesResponse = await axios.get(`${BASE_URL}/firewall/rules`, { headers });
      console.log('✅ GET /firewall/rules successful!');
      console.log(`   Found ${rulesResponse.data.count} rules`);
      console.log(`   Response format:`, {
        success: rulesResponse.data.success,
        count: rulesResponse.data.count,
        dataType: Array.isArray(rulesResponse.data.data) ? 'array' : typeof rulesResponse.data.data
      });
    } catch (error) {
      console.log('❌ GET /firewall/rules failed!');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message}`);
      console.log(`   Error: ${error.response?.data?.error}`);
    }

    // 3. Test GET firewall stats
    console.log('\n3. 📊 Testing GET firewall stats...');
    try {
      const statsResponse = await axios.get(`${BASE_URL}/firewall/rules/stats`, { headers });
      console.log('✅ GET /firewall/rules/stats successful!');
      console.log(`   Total rules: ${statsResponse.data.data.total}`);
      console.log(`   By action:`, statsResponse.data.data.byAction);
    } catch (error) {
      console.log('❌ GET /firewall/rules/stats failed!');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message}`);
    }

    // 4. Test CREATE firewall rule (frontend)
    console.log('\n4. ➕ Testing CREATE firewall rule (frontend)...');
    const testRule = {
      name: 'Test Frontend Rule',
      description: 'Test rule created by frontend API test',
      action: 'allow',
      priority: 100,
      entity_type: 'ip',
      source_ip: '192.168.1.100',
      destination_ip: '10.0.0.1',
      destination_port: 80,
      enabled: true
    };

    try {
      const createResponse = await axios.post(`${BASE_URL}/firewall/rules`, testRule, { headers });
      console.log('✅ POST /firewall/rules successful!');
      console.log(`   Created rule ID: ${createResponse.data.data._id}`);
      
      const ruleId = createResponse.data.data._id;

      // 5. Test GET single rule
      console.log('\n5. 🔍 Testing GET single firewall rule...');
      try {
        const singleRuleResponse = await axios.get(`${BASE_URL}/firewall/rules/${ruleId}`, { headers });
        console.log('✅ GET /firewall/rules/:id successful!');
        console.log(`   Rule name: ${singleRuleResponse.data.data.name}`);
      } catch (error) {
        console.log('❌ GET /firewall/rules/:id failed!');
        console.log(`   Status: ${error.response?.status}`);
        console.log(`   Message: ${error.response?.data?.message}`);
      }

      // 6. Test DELETE rule
      console.log('\n6. 🗑️ Testing DELETE firewall rule...');
      try {
        const deleteResponse = await axios.delete(`${BASE_URL}/firewall/rules/${ruleId}`, { headers });
        console.log('✅ DELETE /firewall/rules/:id successful!');
        console.log(`   Message: ${deleteResponse.data.message}`);
      } catch (error) {
        console.log('❌ DELETE /firewall/rules/:id failed!');
        console.log(`   Status: ${error.response?.status}`);
        console.log(`   Message: ${error.response?.data?.message}`);
      }

    } catch (error) {
      console.log('❌ POST /firewall/rules failed!');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message}`);
      if (error.response?.data?.error) {
        console.log(`   Error: ${error.response.data.error}`);
      }
    }

    console.log('\n🎉 Frontend Firewall API test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', error.response.data);
    }
  }
}

// Run the test
testFirewallFrontendAPI();
