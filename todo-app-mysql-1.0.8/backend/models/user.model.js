const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  zip: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  }
}, { 
  timestamps: true,
  versionKey: false 
});

module.exports = mongoose.model('User', userSchema);