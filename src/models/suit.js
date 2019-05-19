const mongoose = require('mongoose');

const SuitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
  },
  character: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

const Suit = mongoose.model('Suit', SuitSchema);

module.exports = Suit;