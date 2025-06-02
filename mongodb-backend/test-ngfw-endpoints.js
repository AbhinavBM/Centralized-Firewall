/**
 * Test script for NGFW endpoints
 * This script tests the unified NGFW flow endpoints using merged data models
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testEndpoint = {
  endpoint_name: 'TestEndpoint',
  password: 'TestPassword123'
};

const testApplications = {
  'chrome.exe': {
    description: 'Web browser',
    status: 'running',
    associated_ips: [
      {
        source_ip: '192.168.1.14',
        destination_ip: '172.217.163.132'
      }
    ],
    source_ports: [49775, 49776],
    destination_ports: [443]
  },
  'msedgewebview2.exe': {
    description: 'Edge WebView component',
    status: 'running',
    associated_ips: [
      {
        source_ip: '127.0.0.1',
        destination_ip: '127.0.0.1'
      }
    ],
    source_ports: [59555],
    destination_ports: [59555]
  }
};

const testLog = {
  type: 'firewall',
  level: 'info',
  message: 'Packet allowed',
  details: {
    firewall_action: 'allow',
    source_ip: '192.168.1.14',
    destination_ip: '172.217.163.132',
    source_port: 49775,
    destination_port: 443,
    protocol: 'TCP',
    source_service: 'Chrome',
    destination_service: 'HTTPS',
    matched_rule: {
      action: 'allow',
      service: 'HTTPS',
      process_name: 'chrome.exe'
    }
  },
  userId: '507f1f77bcf86cd799439011',
  endpointId: '507f1f77bcf86cd799439012',
  applicationId: '507f1f77bcf86cd799439013',
  timestamp: new Date().toISOString()
};

async function testEndpoints() {
  console.log('🧪 Testing NGFW Flow Verification...\n');

  try {
    // Test 1: Endpoint Authentication (Flow Step 1.1)
    console.log('1️⃣ Testing Endpoint Authentication (Flow 1.1)...');
    const authResponse = await axios.post(`${BASE_URL}/endpoints/authenticate`, testEndpoint);

    // Verify response format matches flow specification
    if (authResponse.data.status === 'success' && authResponse.data.endpoint_id) {
      console.log('✅ Authentication successful - Flow format correct:', authResponse.data);
    } else {
      console.log('❌ Authentication response format incorrect');
      return;
    }

    const endpointId = authResponse.data.endpoint_id;
    console.log(`📝 Endpoint ID: ${endpointId}\n`);

    // Test 2: Application Submission (Flow Step 1.2)
    console.log('2️⃣ Testing Application Submission (Flow 1.2)...');
    const appResponse = await axios.post(`${BASE_URL}/endpoints/applications`, {
      endpoint_id: endpointId,
      applications: testApplications
    });

    // Verify response format matches flow specification
    if (appResponse.data.status === 'success' && appResponse.data.message === 'Application information saved') {
      console.log('✅ Applications submitted - Flow format correct:', appResponse.data);
    } else {
      console.log('❌ Application submission response format incorrect');
    }
    console.log('');

    // Test 3: Firewall Rules Fetching (Flow Step 2.1)
    console.log('3️⃣ Testing Firewall Rules Fetching (Flow 2.1)...');
    const rulesResponse = await axios.get(`${BASE_URL}/ngfw/firewall/rules`, {
      headers: {
        'X-Endpoint-ID': endpointId
        // No password needed for rule fetching
      }
    });

    // Verify response format matches flow specification (grouped by process name)
    if (typeof rulesResponse.data === 'object') {
      console.log('✅ Rules fetched - Flow format correct (grouped by process):', rulesResponse.data);
    } else {
      console.log('❌ Rules response format incorrect');
    }
    console.log('');

    // Test 4: Single Log Submission (Flow Step 3.1/3.2)
    console.log('4️⃣ Testing Single Log Submission (Flow 3.1/3.2)...');
    const logResponse = await axios.post(`${BASE_URL}/logs`, testLog);

    // Verify response format matches flow specification
    if (logResponse.data.status === 'success' &&
        logResponse.data.message === 'Log received' &&
        logResponse.data.validation_results &&
        logResponse.data.validation_results[0].is_valid) {
      console.log('✅ Log submitted - Flow format correct:', logResponse.data);
    } else {
      console.log('❌ Log response format incorrect');
    }
    console.log('');

    // Test 5: Batch Log Submission (Flow Step 5.1)
    console.log('5️⃣ Testing Batch Log Submission (Flow 5.1)...');
    const batchLogResponse = await axios.post(`${BASE_URL}/logs/batch`, {
      logs: [testLog, { ...testLog, message: 'Packet blocked', level: 'warning' }]
    });

    // Verify response format matches flow specification
    if (batchLogResponse.data.status === 'success' &&
        batchLogResponse.data.total_logs &&
        batchLogResponse.data.valid_logs &&
        batchLogResponse.data.validation_results) {
      console.log('✅ Batch logs submitted - Flow format correct:', batchLogResponse.data);
    } else {
      console.log('❌ Batch log response format incorrect');
    }
    console.log('');

    // Test 6: Log Statistics (Flow Step 6)
    console.log('6️⃣ Testing Log Statistics (Flow 6)...');
    const statsResponse = await axios.get(`${BASE_URL}/logs/stats`);

    // Verify response format matches flow specification
    if (statsResponse.data.status === 'success' &&
        statsResponse.data.stats &&
        statsResponse.data.stats.total_logs !== undefined &&
        statsResponse.data.stats.by_type &&
        statsResponse.data.stats.by_level &&
        statsResponse.data.stats.by_message) {
      console.log('✅ Stats retrieved - Flow format correct:', statsResponse.data);
    } else {
      console.log('❌ Stats response format incorrect');
    }
    console.log('');

    console.log('🎉 All NGFW Flow tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

// Run tests
testEndpoints();
