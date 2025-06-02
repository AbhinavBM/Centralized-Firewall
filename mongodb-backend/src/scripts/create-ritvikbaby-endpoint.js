/**
 * Script to create RitvikBaby endpoint in the MongoDB database
 * Run with: node create-ritvikbaby-endpoint.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://roadsidecoder:yCeoaaLmLmYgxpK1@cluster0.yhpeljt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Endpoint schema (based on the Endpoint model)
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

// Create the Endpoint model
const Endpoint = mongoose.model('Endpoint', endpointSchema);

// Connect to MongoDB
async function connectDB() {
  try {
    console.log(`🔗 Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    return false;
  }
}

// Create RitvikBaby endpoint
async function createRitvikBabyEndpoint() {
  try {
    // Check if endpoint already exists
    const existingEndpoint = await Endpoint.findOne({ hostname: 'RitvikBaby' });
    
    if (existingEndpoint) {
      console.log('📍 RitvikBaby endpoint already exists');
      console.log(`   ID: ${existingEndpoint._id}`);
      console.log(`   Hostname: ${existingEndpoint.hostname}`);
      console.log(`   IP Address: ${existingEndpoint.ipAddress}`);
      console.log(`   Status: ${existingEndpoint.status}`);
      return existingEndpoint._id;
    }
    
    // Create new endpoint
    const endpoint = new Endpoint({
      hostname: 'RitvikBaby',
      os: 'Windows 11',
      ipAddress: '192.168.1.100',
      status: 'pending',
      password: 'Ritvik@1234'
    });
    
    const savedEndpoint = await endpoint.save();
    
    console.log('✅ RitvikBaby endpoint created successfully!');
    console.log(`   ID: ${savedEndpoint._id}`);
    console.log(`   Hostname: ${savedEndpoint.hostname}`);
    console.log(`   IP Address: ${savedEndpoint.ipAddress}`);
    console.log(`   Status: ${savedEndpoint.status}`);
    
    return savedEndpoint._id;
  } catch (error) {
    console.error(`❌ Error creating RitvikBaby endpoint: ${error.message}`);
    return null;
  }
}

// Test authentication
async function testAuthentication() {
  try {
    console.log('\n🔐 Testing authentication...');
    
    // Find the endpoint with password included
    const endpoint = await Endpoint.findOne({ hostname: 'RitvikBaby' }).select('+password');
    
    if (!endpoint) {
      console.log('❌ Endpoint not found');
      return false;
    }
    
    // Test password comparison
    const isPasswordValid = await endpoint.comparePassword('Ritvik@1234');
    
    if (isPasswordValid) {
      console.log('✅ Password verification successful');
      console.log(`   Endpoint ID: ${endpoint._id}`);
      return true;
    } else {
      console.log('❌ Password verification failed');
      return false;
    }
  } catch (error) {
    console.error(`❌ Error testing authentication: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Creating RitvikBaby Endpoint for NGFW Integration');
  console.log('=' * 60);
  
  // Connect to MongoDB
  const connected = await connectDB();
  
  if (!connected) {
    console.error('❌ Failed to connect to MongoDB');
    process.exit(1);
  }
  
  // Create endpoint
  const endpointId = await createRitvikBabyEndpoint();
  
  if (endpointId) {
    // Test authentication
    const authSuccess = await testAuthentication();
    
    console.log('\n' + '=' * 60);
    console.log('📊 Summary:');
    console.log(`   Endpoint Creation: ✅ Success`);
    console.log(`   Authentication Test: ${authSuccess ? '✅ Success' : '❌ Failed'}`);
    console.log(`   Endpoint ID: ${endpointId}`);
    
    if (authSuccess) {
      console.log('\n🎉 RitvikBaby endpoint is ready for NGFW integration!');
      console.log('   You can now run: python test_integration.py');
    }
  }
  
  // Disconnect from MongoDB
  await mongoose.disconnect();
  console.log('\n🔌 MongoDB disconnected');
  
  process.exit(0);
}

// Run the main function
main();
