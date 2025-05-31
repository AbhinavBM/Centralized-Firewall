const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test credentials (use your actual admin credentials)
const TEST_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

async function testFirewallAPI() {
  try {
    console.log('🔥 Testing Firewall API Endpoints...\n');

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

    // 2. Test GET all firewall rules
    console.log('\n2. 📋 Testing GET all firewall rules...');
    try {
      const rulesResponse = await axios.get(`${BASE_URL}/firewall/rules`, { headers });
      console.log('✅ GET /firewall/rules successful!');
      console.log(`   Found ${rulesResponse.data.count} rules`);
    } catch (error) {
      console.log('❌ GET /firewall/rules failed!');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message}`);
    }

    // 3. Test GET firewall stats
    console.log('\n3. 📊 Testing GET firewall stats...');
    try {
      const statsResponse = await axios.get(`${BASE_URL}/firewall/rules/stats`, { headers });
      console.log('✅ GET /firewall/rules/stats successful!');
      console.log(`   Total rules: ${statsResponse.data.data.total}`);
    } catch (error) {
      console.log('❌ GET /firewall/rules/stats failed!');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message}`);
    }

    // 4. Test CREATE firewall rule
    console.log('\n4. ➕ Testing CREATE firewall rule...');
    const testRule = {
      name: 'Test Rule',
      description: 'Test rule created by API test',
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

      // 6. Test UPDATE rule
      console.log('\n6. ✏️ Testing UPDATE firewall rule...');
      const updateData = {
        name: 'Updated Test Rule',
        description: 'Updated description',
        priority: 200
      };

      try {
        const updateResponse = await axios.put(`${BASE_URL}/firewall/rules/${ruleId}`, updateData, { headers });
        console.log('✅ PUT /firewall/rules/:id successful!');
        console.log(`   Updated rule name: ${updateResponse.data.data.name}`);
      } catch (error) {
        console.log('❌ PUT /firewall/rules/:id failed!');
        console.log(`   Status: ${error.response?.status}`);
        console.log(`   Message: ${error.response?.data?.message}`);
      }

      // 7. Test DELETE rule
      console.log('\n7. 🗑️ Testing DELETE firewall rule...');
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

    console.log('\n🎉 Firewall API test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', error.response.data);
    }
  }
}

// Run the test
testFirewallAPI();
