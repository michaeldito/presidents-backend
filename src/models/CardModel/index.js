const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  shortHand: {
    type: String,
    required: true
  },
  cardRank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CardRank'
  },
  suit: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Suit'
  }
});

const CardModel = mongoose.model('Card', CardSchema);

module.exports = CardModel;