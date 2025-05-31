const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const endpointSchema = new mongoose.Schema({
  hostname: {
    type: String,
    required: [true, 'Hostname is required'],
    trim: true
  },
  os: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String,
    required: [true, 'IP address is required'],
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['online', 'offline', 'pending', 'error'],
    default: 'pending'
  },
  password: {
    type: String,
    select: false // Don't include password in query results by default
  },
  applicationIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Application',
    default: []
  },
  lastHeartbeat: {
    type: Date,
    default: null
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

// Hash password before saving
endpointSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new) and exists
  if (!this.isModified('password') || !this.password) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
endpointSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index for faster queries
endpointSchema.index({ hostname: 1 });
endpointSchema.index({ ipAddress: 1 });
endpointSchema.index({ status: 1 });

const Endpoint = mongoose.model('Endpoint', endpointSchema);

module.exports = Endpoint;
