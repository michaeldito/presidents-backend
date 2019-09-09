const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  shortHand: {
    type: String,
    required: [true, 'A shorthand is required for every card.'],
    unique: true
  },
  cardRank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CardRank',
    required: [true, 'A card rank is required for every card.'],
    autopopulate: true
  },
  suit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Suit',
    required: [true, 'A suit is required for every card.'],
    autopopulate: true
  }
});

CardSchema.statics.getDeck = function() {
  return this.find({});
}

CardSchema.plugin(require('mongoose-autopopulate'));
CardSchema.plugin(require('mongoose-unique-validator'));

const Card = mongoose.model('Card', CardSchema);

module.exports = Card;