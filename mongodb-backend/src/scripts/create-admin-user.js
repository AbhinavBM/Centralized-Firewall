/**
 * Script to create an admin user in the MongoDB database
 * Run with: node create-admin-user.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://roadsidecoder:yCeoaaLmLmYgxpK1@cluster0.yhpeljt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// User schema (simplified version of the User model)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
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
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Connect to MongoDB
async function connectDB() {
  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    return false;
  }
}

// Create admin user
async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await User.findOne({ username: 'admin' });
    
    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create new admin user
    const adminUser = new User({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
    
    await adminUser.save();
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error(`Error creating admin user: ${error.message}`);
  }
}

// Main function
async function main() {
  // Connect to MongoDB
  const connected = await connectDB();
  
  if (!connected) {
    console.error('Failed to connect to MongoDB');
    process.exit(1);
  }
  
  // Create admin user
  await createAdminUser();
  
  // Disconnect from MongoDB
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
  
  process.exit(0);
}

// Run the main function
main();
