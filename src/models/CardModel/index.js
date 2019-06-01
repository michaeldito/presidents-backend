const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  shortHand: {
    type: String,
    required: true
  },
  cardRank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CardRank',
    required: true
  },
  suit: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Suit'
  }
});

CardSchema.statics.getDeck = function() {
  return this.find({});
}

const CardModel = mongoose.model('Card', CardSchema);

module.exports = CardModel;