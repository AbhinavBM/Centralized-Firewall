const mongoose = require('mongoose');

const trafficLogSchema = new mongoose.Schema({
  endpointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Endpoint',
    required: [true, 'Endpoint ID is required']
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sourceIp: {
    type: String,
    required: [true, 'Source IP is required']
  },
  destinationIp: {
    type: String,
    required: [true, 'Destination IP is required']
  },
  protocol: {
    type: String,
    enum: ['TCP', 'UDP', 'ICMP'],
    required: [true, 'Protocol is required']
  },
  status: {
    type: String,
    enum: ['allowed', 'blocked'],
    required: [true, 'Status is required']
  },
  trafficType: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: [true, 'Traffic type is required']
  },
  dataTransferred: {
    type: Number,
    default: 0
  },
  sourcePort: {
    type: Number
  },
  destinationPort: {
    type: Number
  },
  packetData: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
trafficLogSchema.index({ endpointId: 1 });
trafficLogSchema.index({ timestamp: -1 });
trafficLogSchema.index({ status: 1 });
trafficLogSchema.index({ trafficType: 1 });

const TrafficLog = mongoose.model('TrafficLog', trafficLogSchema);

module.exports = TrafficLog;
