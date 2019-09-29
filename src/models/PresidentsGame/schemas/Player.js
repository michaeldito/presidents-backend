const mongoose = require('mongoose');

const DrinkReceivedSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A value for players[i].drinksReceived.sentBy is required.']
  }
});

const DrinkSentSchema = new mongoose.Schema({
  createdAt: {
    type: Date
  },
  sentTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A value for players[i].drinksSent.sentTo is required.']
  }
});

const PlayerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A value for players[i].user is required.']
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  seatPosition: {
    type: Number,
    required: [true, 'A value for players[i].seatPosition is required.']
  },
  hand: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card',
    autopopulate: true
  },
  politicalRank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoliticalRank',
    autopopulate: true
  },
  nextGameRank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoliticalRank',
    autopopulate: true
  },
  drinksDrunk: {
    type: Number,
    required: true
  },
  drinksReceived: {
    type: [DrinkReceivedSchema],
    required: true
  },
  drinksSent: {
    type: [DrinkSentSchema],
    required: true
  },
});

PlayerSchema.plugin(require('mongoose-autopopulate'));

module.exports = PlayerSchema;