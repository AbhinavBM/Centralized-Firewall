const mongoose = require('mongoose');

const firewallRuleSchema = new mongoose.Schema({
  endpointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Endpoint',
    default: null  // Optional - null for frontend rules
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    default: null  // Optional - can create standalone rules
  },
  processName: {
    type: String,
    trim: true,
    default: null  // Optional - only for NGFW rules
  },
  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // NGFW flow fields
  entity_type: {
    type: String,
    enum: ['ip', 'domain'],
    default: 'ip'  // Default to 'ip' instead of required
  },
  // For IP-based rules
  source_ip: {
    type: String,
    trim: true
  },
  destination_ip: {
    type: String,
    trim: true
  },
  source_port: {
    type: Number
  },
  destination_port: {
    type: Number
  },
  // For domain-based rules
  domain_name: {
    type: String,
    trim: true
  },
  action: {
    type: String,
    enum: ['allow', 'deny', 'ALLOW', 'DENY'],
    required: [true, 'Action is required']
  },
  // Legacy fields for backward compatibility
  entityType: {
    type: String,
    enum: ['ip', 'domain'],
    default: 'ip'
  },
  domain: {
    type: String,
    trim: true
  },
  sourceIp: {
    type: String
  },
  destinationIp: {
    type: String
  },
  sourcePort: {
    type: Number
  },
  destinationPort: {
    type: Number
  },
  protocol: {
    type: String,
    enum: ['TCP', 'UDP', 'ICMP', 'ANY'],
    default: 'ANY'
  },
  priority: {
    type: Number,
    default: 0
  },
  enabled: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
firewallRuleSchema.index({ endpointId: 1 });
firewallRuleSchema.index({ processName: 1 });
firewallRuleSchema.index({ endpointId: 1, processName: 1 });
firewallRuleSchema.index({ applicationId: 1 });
firewallRuleSchema.index({ priority: 1 });
firewallRuleSchema.index({ enabled: 1 });

const FirewallRule = mongoose.model('FirewallRule', firewallRuleSchema);

module.exports = FirewallRule;
