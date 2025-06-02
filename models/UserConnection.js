const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  isConnected: Boolean,
  connectedServer: String,
  lastSeen: Date
}, { timestamps: true });

module.exports = mongoose.model('UserConnection', schema);
