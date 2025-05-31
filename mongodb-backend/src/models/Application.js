const mongoose = require('mongoose');

// Schema for individual IP associations
const ipAssociationSchema = new mongoose.Schema({
  source_ip: {
    type: String,
    required: true
  },
  destination_ip: {
    type: String,
    required: true
  }
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  endpointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Endpoint',
    required: [true, 'Endpoint ID is required']
  },
  name: {
    type: String,
    required: [true, 'Application name is required'],
    trim: true
  },
  processName: {
    type: String,
    required: [true, 'Process name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['running', 'stopped', 'pending', 'allowed', 'blocked', 'suspended'],
    default: 'running'
  },
  // NGFW-specific fields
  associated_ips: {
    type: [ipAssociationSchema],
    default: []
  },
  source_ports: {
    type: [Number],
    default: []
  },
  destination_ports: {
    type: [Number],
    default: []
  },
  // Legacy fields for backward compatibility
  allowedDomains: {
    type: [String],
    default: []
  },
  allowedIps: {
    type: [String],
    default: []
  },
  allowedProtocols: {
    type: [String],
    default: []
  },
  firewallPolicies: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  lastUpdated: {
    type: Date,
    default: Date.now
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
applicationSchema.index({ endpointId: 1 });
applicationSchema.index({ processName: 1 });
applicationSchema.index({ endpointId: 1, processName: 1 }, { unique: true });
applicationSchema.index({ name: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
