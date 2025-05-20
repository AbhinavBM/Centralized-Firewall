const mongoose = require('mongoose');

const endpointApplicationMappingSchema = new mongoose.Schema({
  endpointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Endpoint',
    required: [true, 'Endpoint ID is required']
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: [true, 'Application ID is required']
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'error'],
    default: 'active'
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

// Ensure unique mapping between endpoint and application
endpointApplicationMappingSchema.index({ endpointId: 1, applicationId: 1 }, { unique: true });

const EndpointApplicationMapping = mongoose.model('EndpointApplicationMapping', endpointApplicationMappingSchema);

module.exports = EndpointApplicationMapping;
