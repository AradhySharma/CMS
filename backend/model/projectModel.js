const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['VIEWER', 'EDITOR', 'PUBLISHER', 'ADMIN'],
      default: 'VIEWER'
    }
  }],
  isDeleted: {
    type: Boolean, 
    default: false
},
deletedAt: {
  type: Date,
},
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;