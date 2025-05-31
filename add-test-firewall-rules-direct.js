const mongoose = require('mongoose');
require('dotenv').config({ path: './mongodb-backend/.env' });

// Define the FirewallRule schema (simplified version)
const firewallRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  action: { type: String, enum: ['allow', 'deny'], required: true },
  priority: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },

  // NGFW fields
  entity_type: { type: String, enum: ['ip', 'domain'], default: 'ip' },
  source_ip: String,
  destination_ip: String,
  source_port: Number,
  destination_port: Number,
  domain_name: String,

  // Optional references
  endpointId: { type: mongoose.Schema.Types.ObjectId, ref: 'Endpoint' },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  processName: String,
}, {
  timestamps: true
});

const FirewallRule = mongoose.model('FirewallRule', firewallRuleSchema);

async function addTestFirewallRules() {
  try {
    console.log('🔥 Adding Test Firewall Rules Directly to Database...\n');

    // Connect to MongoDB
    console.log('1. 🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Clear existing rules (optional)
    console.log('\n2. 🧹 Clearing existing firewall rules...');
    await FirewallRule.deleteMany({});
    console.log('✅ Existing rules cleared!');

    // First, let's create some test applications if they don't exist
    const Application = mongoose.model('Application', new mongoose.Schema({
      name: String,
      processName: String,
      description: String,
      version: String,
      status: { type: String, default: 'active' }
    }, { timestamps: true }));

    console.log('\n2.1. 📱 Creating test applications...');
    await Application.deleteMany({}); // Clear existing apps

    const testApps = await Application.insertMany([
      {
        name: 'Google Chrome',
        processName: 'chrome.exe',
        description: 'Web browser application',
        version: '120.0.0.0'
      },
      {
        name: 'Mozilla Firefox',
        processName: 'firefox.exe',
        description: 'Web browser application',
        version: '121.0.0.0'
      },
      {
        name: 'Microsoft Teams',
        processName: 'teams.exe',
        description: 'Communication and collaboration platform',
        version: '1.6.0.0'
      }
    ]);

    console.log(`✅ Created ${testApps.length} test applications!`);

    // Create test firewall rules with application associations
    const testRules = [
      // Chrome-specific rules
      {
        name: 'Chrome - Allow HTTPS',
        description: 'Allow Chrome to access HTTPS websites',
        action: 'allow',
        priority: 100,
        entity_type: 'ip',
        destination_port: 443,
        enabled: true,
        applicationId: testApps[0]._id,
        processName: 'chrome.exe'
      },
      {
        name: 'Chrome - Block Social Media',
        description: 'Block Chrome access to Facebook',
        action: 'deny',
        priority: 200,
        entity_type: 'domain',
        domain_name: 'facebook.com',
        enabled: true,
        applicationId: testApps[0]._id,
        processName: 'chrome.exe'
      },
      {
        name: 'Chrome - Allow Google Services',
        description: 'Allow Chrome to access Google services',
        action: 'allow',
        priority: 50,
        entity_type: 'domain',
        domain_name: 'google.com',
        enabled: true,
        applicationId: testApps[0]._id,
        processName: 'chrome.exe'
      },
      // Firefox-specific rules
      {
        name: 'Firefox - Allow HTTP',
        description: 'Allow Firefox to access HTTP websites',
        action: 'allow',
        priority: 150,
        entity_type: 'ip',
        destination_port: 80,
        enabled: true,
        applicationId: testApps[1]._id,
        processName: 'firefox.exe'
      },
      {
        name: 'Firefox - Block Ads',
        description: 'Block Firefox access to ad networks',
        action: 'deny',
        priority: 300,
        entity_type: 'domain',
        domain_name: 'doubleclick.net',
        enabled: true,
        applicationId: testApps[1]._id,
        processName: 'firefox.exe'
      },
      // Teams-specific rules
      {
        name: 'Teams - Allow Communication',
        description: 'Allow Teams communication ports',
        action: 'allow',
        priority: 75,
        entity_type: 'ip',
        destination_port: 443,
        enabled: true,
        applicationId: testApps[2]._id,
        processName: 'teams.exe'
      },
      {
        name: 'Teams - Allow Media',
        description: 'Allow Teams media streaming',
        action: 'allow',
        priority: 80,
        entity_type: 'ip',
        destination_port: 3478,
        enabled: true,
        applicationId: testApps[2]._id,
        processName: 'teams.exe'
      },
      // General rules (no application)
      {
        name: 'General - Allow DNS',
        description: 'Allow DNS queries to Google DNS',
        action: 'allow',
        priority: 25,
        entity_type: 'ip',
        destination_ip: '8.8.8.8',
        destination_port: 53,
        enabled: true
      },
      {
        name: 'General - Block Malicious IP',
        description: 'Block traffic from suspicious IP address',
        action: 'deny',
        priority: 500,
        entity_type: 'ip',
        source_ip: '192.168.1.100',
        enabled: true
      },
      {
        name: 'General - Allow SSH',
        description: 'Allow SSH connections on port 22',
        action: 'allow',
        priority: 200,
        entity_type: 'ip',
        destination_port: 22,
        enabled: false
      }
    ];

    console.log('\n2.2. 📝 Creating test firewall rules...');

    const createdRules = await FirewallRule.insertMany(testRules);
    console.log(`✅ Created ${createdRules.length} test firewall rules!`);

    // Display created rules
    console.log('\n📋 Created rules:');
    createdRules.forEach((rule, index) => {
      console.log(`   ${index + 1}. ${rule.name} (${rule.action}) - ${rule.entity_type} - Priority: ${rule.priority}`);
    });

    // Verify rules in database
    console.log('\n4. 🔍 Verifying rules in database...');
    const totalRules = await FirewallRule.countDocuments();
    console.log(`✅ Total firewall rules in database: ${totalRules}`);

    // Get statistics
    const allowRules = await FirewallRule.countDocuments({ action: 'allow' });
    const denyRules = await FirewallRule.countDocuments({ action: 'deny' });
    const enabledRules = await FirewallRule.countDocuments({ enabled: true });
    const disabledRules = await FirewallRule.countDocuments({ enabled: false });
    const ipRules = await FirewallRule.countDocuments({ entity_type: 'ip' });
    const domainRules = await FirewallRule.countDocuments({ entity_type: 'domain' });

    console.log('\n📊 Statistics:');
    console.log(`   - Allow rules: ${allowRules}`);
    console.log(`   - Deny rules: ${denyRules}`);
    console.log(`   - Enabled rules: ${enabledRules}`);
    console.log(`   - Disabled rules: ${disabledRules}`);
    console.log(`   - IP rules: ${ipRules}`);
    console.log(`   - Domain rules: ${domainRules}`);

    console.log('\n🎉 Test firewall rules added successfully!');
    console.log('\n💡 You can now test the frontend firewall page at: http://localhost:3001/firewall');

  } catch (error) {
    console.error('❌ Error adding test firewall rules:', error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the script
addTestFirewallRules();
