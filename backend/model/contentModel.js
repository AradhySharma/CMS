const mongoose = require('mongoose');
const { Schema } = mongoose;

const contentSchema = new Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['text', 'email', 'image', 'audio', 'video', 'pdf'], required: true },
    content: { type: String, required: true },
    version: {type: Number,default: 1}, 
    draft: { type: Boolean, default: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
    isDeleted: {type: Boolean, default: false},     deletedAt: {type: Date}, 
  });

module.exports = mongoose.model('Content', contentSchema);