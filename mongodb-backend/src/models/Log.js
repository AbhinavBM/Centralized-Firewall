const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['system', 'user', 'firewall', 'endpoint', 'application'],
    required: [true, 'Log type is required']
  },
  level: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    required: [true, 'Log level is required']
  },
  message: {
    type: String,
    required: [true, 'Log message is required']
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  endpointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Endpoint'
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
logSchema.index({ type: 1 });
logSchema.index({ level: 1 });
logSchema.index({ timestamp: -1 });
logSchema.index({ userId: 1 });
logSchema.index({ endpointId: 1 });
logSchema.index({ applicationId: 1 });

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
