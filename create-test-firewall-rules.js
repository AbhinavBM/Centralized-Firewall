const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test credentials
const TEST_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

async function createTestFirewallRules() {
  try {
    console.log('🔥 Creating Test Firewall Rules...\n');

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

    // 2. Create test firewall rules
    const testRules = [
      {
        name: 'Allow HTTP Traffic',
        description: 'Allow HTTP traffic on port 80',
        action: 'allow',
        priority: 100,
        entity_type: 'ip',
        destination_port: 80,
        enabled: true
      },
      {
        name: 'Allow HTTPS Traffic',
        description: 'Allow HTTPS traffic on port 443',
        action: 'allow',
        priority: 100,
        entity_type: 'ip',
        destination_port: 443,
        enabled: true
      },
      {
        name: 'Block Facebook',
        description: 'Block access to Facebook domain',
        action: 'deny',
        priority: 200,
        entity_type: 'domain',
        domain_name: 'facebook.com',
        enabled: true
      },
      {
        name: 'Block Suspicious IP',
        description: 'Block traffic from suspicious IP address',
        action: 'deny',
        priority: 300,
        entity_type: 'ip',
        source_ip: '192.168.1.100',
        enabled: true
      },
      {
        name: 'Allow Google DNS',
        description: 'Allow DNS queries to Google DNS',
        action: 'allow',
        priority: 50,
        entity_type: 'ip',
        destination_ip: '8.8.8.8',
        destination_port: 53,
        enabled: true
      }
    ];

    console.log('\n2. 📝 Creating test firewall rules...');
    
    for (let i = 0; i < testRules.length; i++) {
      const rule = testRules[i];
      try {
        const createResponse = await axios.post(`${BASE_URL}/firewall/rules`, rule, { headers });
        console.log(`✅ Created rule ${i + 1}: ${rule.name}`);
      } catch (error) {
        console.log(`❌ Failed to create rule ${i + 1}: ${rule.name}`);
        console.log(`   Error: ${error.response?.data?.message || error.message}`);
      }
    }

    // 3. Verify rules were created
    console.log('\n3. 🔍 Verifying created rules...');
    try {
      const rulesResponse = await axios.get(`${BASE_URL}/firewall/rules`, { headers });
      console.log(`✅ Total firewall rules in database: ${rulesResponse.data.count}`);
      
      if (rulesResponse.data.data && rulesResponse.data.data.length > 0) {
        console.log('\n📋 Current rules:');
        rulesResponse.data.data.forEach((rule, index) => {
          console.log(`   ${index + 1}. ${rule.name} (${rule.action}) - ${rule.entity_type}`);
        });
      }
    } catch (error) {
      console.log('❌ Failed to fetch rules for verification');
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    // 4. Test firewall stats
    console.log('\n4. 📊 Testing firewall stats...');
    try {
      const statsResponse = await axios.get(`${BASE_URL}/firewall/rules/stats`, { headers });
      console.log('✅ Firewall stats retrieved successfully!');
      console.log(`   Total rules: ${statsResponse.data.data.total}`);
      console.log(`   By action:`, statsResponse.data.data.byAction);
      console.log(`   By entity type:`, statsResponse.data.data.byEntityType);
    } catch (error) {
      console.log('❌ Failed to get firewall stats');
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    console.log('\n🎉 Test firewall rules creation completed!');
    console.log('\n💡 You can now test the frontend firewall page at: http://localhost:3001/firewall');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', error.response.data);
    }
  }
}

// Run the script
createTestFirewallRules();
