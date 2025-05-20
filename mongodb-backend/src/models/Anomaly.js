const mongoose = require('mongoose');

const anomalySchema = new mongoose.Schema({
  endpointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Endpoint',
    required: [true, 'Endpoint ID is required']
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  anomalyType: {
    type: String,
    required: [true, 'Anomaly type is required']
  },
  description: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: [true, 'Severity is required']
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
anomalySchema.index({ endpointId: 1 });
anomalySchema.index({ timestamp: -1 });
anomalySchema.index({ severity: 1 });
anomalySchema.index({ resolved: 1 });

const Anomaly = mongoose.model('Anomaly', anomalySchema);

module.exports = Anomaly;
