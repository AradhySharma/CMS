const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['VIEWER', 'EDITOR', 'PUBLISHER', 'ADMIN', 'SUPERADMIN'],
    default: 'VIEWER',
  },
  secretQuestion:{
    question:{
      type:String,
      required:true
    },
    answer:{
      type:String,
      required:true
  }
  }
},{timestamps:true});

module.exports = mongoose.model('User', userSchema);