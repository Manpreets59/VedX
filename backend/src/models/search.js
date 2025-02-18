const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true
  },
  results: {
    type: Array,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  relatedQuestions: {
    type: Array,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Search', searchSchema);