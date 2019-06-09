const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  shortHand: {
    type: String,
    required: true
  },
  cardRank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CardRank',
    required: true,
    autopopulate: true
  },
  suit: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Suit',
    autopopulate: true
  }
});

CardSchema.statics.getDeck = function() {
  return this.find({});
}

CardSchema.plugin(require('mongoose-autopopulate'));

const CardModel = mongoose.model('Card', CardSchema);

module.exports = CardModel;