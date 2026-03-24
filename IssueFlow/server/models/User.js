const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  githubUsername: {
    type: String,
  },
  stats: {
    issuesCreated: { type: Number, default: 0 },
    issuesSolved: { type: Number, default: 0 },
    prsSubmitted: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
