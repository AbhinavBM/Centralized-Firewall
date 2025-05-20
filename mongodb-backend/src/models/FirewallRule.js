const mongoose = require('mongoose');

const firewallRuleSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: [true, 'Application ID is required']
  },
  name: {
    type: String,
    required: [true, 'Rule name is required'],
    trim: true
  },
  description: {
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
  action: {
    type: String,
    enum: ['ALLOW', 'DENY'],
    required: [true, 'Action is required']
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
firewallRuleSchema.index({ applicationId: 1 });
firewallRuleSchema.index({ priority: 1 });
firewallRuleSchema.index({ enabled: 1 });

const FirewallRule = mongoose.model('FirewallRule', firewallRuleSchema);

module.exports = FirewallRule;
