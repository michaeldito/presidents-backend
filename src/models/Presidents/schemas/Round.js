const mongoose = require('mongoose');
const TurnSchema = require('./Turn');

module.exports = new mongoose.Schema({
  startedAt: {
    type: Date,
    default: Date.now
  },
  turns: {
    type: [TurnSchema],
  }
});