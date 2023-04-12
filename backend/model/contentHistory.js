const mongoose = require('mongoose');
const { Schema } = mongoose;
// ContentHistory Schema
const contentHistorySchema = new Schema({
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
    version: { type: Number, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['text', 'email', 'image', 'audio', 'video'], required: true },
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, default: 'null'},
    createdOn: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('History',contentHistorySchema);