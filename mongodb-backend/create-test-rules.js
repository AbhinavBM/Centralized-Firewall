const mongoose = require('mongoose');
const { Endpoint, FirewallRule } = require('./src/models');
require('dotenv').config({ path: './src/.env' });

async function createTestRules() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find RitvikBaby endpoint
    const endpoint = await Endpoint.findOne({ hostname: 'RitvikBaby' });
    if (!endpoint) {
      console.log('❌ RitvikBaby endpoint not found. Please run create-ritvikbaby-endpoint.js first');
      return;
    }

    console.log(`📍 Found endpoint: ${endpoint.hostname} (${endpoint._id})`);

    // Delete existing rules for this endpoint
    await FirewallRule.deleteMany({ endpointId: endpoint._id });
    console.log('🗑️ Cleared existing rules');

    // Create test firewall rules
    const testRules = [
      {
        endpointId: endpoint._id,
        processName: 'chrome.exe',
        entity_type: 'ip',
        source_ip: null,
        destination_ip: '8.8.8.8',
        source_port: null,
        destination_port: 53,
        action: 'allow',
        priority: 10,
        description: 'Allow Chrome DNS to Google DNS',
        enabled: true
      },
      {
        endpointId: endpoint._id,
        processName: 'chrome.exe',
        entity_type: 'domain',
        domain_name: 'google.com',
        action: 'allow',
        priority: 20,
        description: 'Allow Chrome access to Google',
        enabled: true
      },
      {
        endpointId: endpoint._id,
        processName: 'firefox.exe',
        entity_type: 'ip',
        source_ip: null,
        destination_ip: '1.1.1.1',
        source_port: null,
        destination_port: 53,
        action: 'allow',
        priority: 15,
        description: 'Allow Firefox DNS to Cloudflare DNS',
        enabled: true
      },
      {
        endpointId: endpoint._id,
        processName: 'malware.exe',
        entity_type: 'ip',
        source_ip: null,
        destination_ip: null,
        source_port: null,
        destination_port: null,
        action: 'deny',
        priority: 100,
        description: 'Block all traffic from malware.exe',
        enabled: true
      },
      {
        endpointId: endpoint._id,
        processName: 'browser.exe',
        entity_type: 'domain',
        domain_name: 'facebook.com',
        action: 'deny',
        priority: 50,
        description: 'Block access to Facebook',
        enabled: true
      },
      {
        endpointId: endpoint._id,
        processName: 'system',
        entity_type: 'ip',
        source_ip: null,
        destination_ip: null,
        source_port: 80,
        destination_port: null,
        action: 'allow',
        priority: 5,
        description: 'Allow HTTP traffic',
        enabled: true
      },
      {
        endpointId: endpoint._id,
        processName: 'system',
        entity_type: 'ip',
        source_ip: null,
        destination_ip: null,
        source_port: 443,
        destination_port: null,
        action: 'allow',
        priority: 5,
        description: 'Allow HTTPS traffic',
        enabled: true
      }
    ];

    // Insert test rules
    const createdRules = await FirewallRule.insertMany(testRules);
    console.log(`✅ Created ${createdRules.length} test firewall rules`);

    // Display created rules grouped by process
    const rulesByProcess = {};
    createdRules.forEach(rule => {
      if (!rulesByProcess[rule.processName]) {
        rulesByProcess[rule.processName] = [];
      }
      rulesByProcess[rule.processName].push(rule);
    });

    console.log('\n📋 Created Rules Summary:');
    console.log('=' * 50);
    
    for (const [processName, rules] of Object.entries(rulesByProcess)) {
      console.log(`\n🔧 ${processName}:`);
      rules.forEach((rule, index) => {
        console.log(`   ${index + 1}. ${rule.action.toUpperCase()} - ${rule.entity_type}`);
        if (rule.entity_type === 'ip') {
          const src = rule.source_ip || 'any';
          const dst = rule.destination_ip || 'any';
          const srcPort = rule.source_port || 'any';
          const dstPort = rule.destination_port || 'any';
          console.log(`      ${src}:${srcPort} -> ${dst}:${dstPort}`);
        } else if (rule.entity_type === 'domain') {
          console.log(`      Domain: ${rule.domain_name}`);
        }
        console.log(`      Description: ${rule.description}`);
      });
    }

    console.log('\n🎯 Test Rules Created Successfully!');
    console.log('\nNow you can test rules fetching with:');
    console.log('1. cd NGFW && python test_rules_fetch.py');
    console.log('2. python test-complete-flow.py');
    console.log('3. cd NGFW && python test_integration.py');

  } catch (error) {
    console.error('❌ Error creating test rules:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
}

// Run the script
createTestRules();
