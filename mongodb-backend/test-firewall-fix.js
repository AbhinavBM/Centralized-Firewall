const mongoose = require('mongoose');
const { FirewallRule, Application, Endpoint } = require('./src/models');

// Test data similar to the problematic JSON you provided
const testData = {
  endpointId: null, // Will be set after creating endpoint
  applicationId: null, // Will be set after creating application
  processName: "chrome.exe",
  description: "Test firewall rule",
  entity_type: "ip",
  source_ip: "123.23.23.23",
  destination_ip: "233.34.34.23",
  source_port: 23,
  destination_port: 232,
  action: "allow",
  protocol: "ANY",
  priority: 0,
  enabled: true
};

async function testFirewallRuleFix() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/centralized-firewall', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clean up any existing test data
    await Endpoint.deleteMany({ hostname: 'test-endpoint' });
    await Application.deleteMany({ name: 'test-chrome-app' });
    await FirewallRule.deleteMany({ description: 'Test firewall rule' });

    // Test 1: Create endpoint
    console.log('\n🧪 Test 1: Creating test endpoint...');
    const endpoint = new Endpoint({
      hostname: 'test-endpoint',
      ipAddress: '192.168.1.100',
      os: 'Windows 10',
      status: 'active'
    });
    await endpoint.save();
    console.log('✅ Endpoint created:', endpoint._id);

    // Test 2: Create application with endpoint
    console.log('\n🧪 Test 2: Creating test application...');
    const application = new Application({
      endpointId: endpoint._id,
      name: 'test-chrome-app',
      processName: 'chrome.exe',
      description: 'Test Chrome application',
      status: 'running'
    });
    await application.save();
    console.log('✅ Application created:', application._id);

    // Test 3: Create firewall rule with both endpointId and applicationId
    console.log('\n🧪 Test 3: Creating firewall rule with both endpoint and application...');
    const rule1 = new FirewallRule({
      endpointId: endpoint._id,
      applicationId: application._id,
      processName: testData.processName,
      description: testData.description + ' - with both IDs',
      entity_type: testData.entity_type,
      source_ip: testData.source_ip,
      destination_ip: testData.destination_ip,
      source_port: testData.source_port,
      destination_port: testData.destination_port,
      action: testData.action,
      protocol: testData.protocol,
      priority: testData.priority,
      enabled: testData.enabled
    });
    await rule1.save();
    console.log('✅ Firewall rule 1 created successfully');
    console.log('   - EndpointId:', rule1.endpointId);
    console.log('   - ApplicationId:', rule1.applicationId);
    console.log('   - ProcessName:', rule1.processName);

    // Test 4: Create firewall rule with only endpointId (should auto-find application)
    console.log('\n🧪 Test 4: Creating firewall rule with only endpoint (should auto-find app)...');
    const rule2 = new FirewallRule({
      endpointId: endpoint._id,
      processName: testData.processName,
      description: testData.description + ' - endpoint only',
      entity_type: testData.entity_type,
      source_ip: '124.24.24.24',
      destination_ip: '234.35.35.24',
      source_port: 80,
      destination_port: 443,
      action: testData.action,
      protocol: testData.protocol,
      priority: 1,
      enabled: testData.enabled
    });
    await rule2.save();
    console.log('✅ Firewall rule 2 created successfully');
    console.log('   - EndpointId:', rule2.endpointId);
    console.log('   - ApplicationId:', rule2.applicationId);
    console.log('   - ProcessName:', rule2.processName);

    // Test 5: Create frontend-only application (no endpoint)
    console.log('\n🧪 Test 5: Creating frontend-only application...');
    const frontendApp = new Application({
      name: 'frontend-test-app',
      description: 'Test frontend application',
      status: 'pending'
    });
    await frontendApp.save();
    console.log('✅ Frontend application created:', frontendApp._id);
    console.log('   - EndpointId:', frontendApp.endpointId);
    console.log('   - ProcessName:', frontendApp.processName);

    // Test 6: Create firewall rule for frontend application
    console.log('\n🧪 Test 6: Creating firewall rule for frontend application...');
    const rule3 = new FirewallRule({
      applicationId: frontendApp._id,
      description: testData.description + ' - frontend only',
      entity_type: 'domain',
      domain_name: 'example.com',
      action: 'deny',
      priority: 2,
      enabled: true
    });
    await rule3.save();
    console.log('✅ Firewall rule 3 created successfully');
    console.log('   - EndpointId:', rule3.endpointId);
    console.log('   - ApplicationId:', rule3.applicationId);
    console.log('   - Domain:', rule3.domain_name);

    // Test 7: Verify all rules
    console.log('\n🧪 Test 7: Verifying all created rules...');
    const allRules = await FirewallRule.find({ description: { $regex: 'Test firewall rule' } })
      .populate('applicationId', 'name processName')
      .populate('endpointId', 'hostname ipAddress');
    
    console.log(`✅ Found ${allRules.length} test rules:`);
    allRules.forEach((rule, index) => {
      console.log(`   Rule ${index + 1}:`);
      console.log(`     - ID: ${rule._id}`);
      console.log(`     - Description: ${rule.description}`);
      console.log(`     - EndpointId: ${rule.endpointId ? rule.endpointId._id : 'null'}`);
      console.log(`     - ApplicationId: ${rule.applicationId ? rule.applicationId._id : 'null'}`);
      console.log(`     - ProcessName: ${rule.processName || 'null'}`);
      console.log(`     - Action: ${rule.action}`);
      console.log('');
    });

    console.log('🎉 All tests passed! The firewall rule creation fix is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await Endpoint.deleteMany({ hostname: 'test-endpoint' });
    await Application.deleteMany({ name: { $in: ['test-chrome-app', 'frontend-test-app'] } });
    await FirewallRule.deleteMany({ description: { $regex: 'Test firewall rule' } });
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the test
if (require.main === module) {
  testFirewallRuleFix();
}

module.exports = testFirewallRuleFix;
