const mongoose = require('mongoose');

const options = { 
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
};

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
}, options);

DrinkReceivedSchema.virtual('displayId').get(function() {
  let { createdAt, sentBy } = this;
  return `${createdAt} - sentBy: ${sentBy}`;
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
}, options);

DrinkSentSchema.virtual('displayId').get(function() {
  let { createdAt, sentTo } = this;
  return `${createdAt} - sentTo: ${sentTo}`;
});


const PlayerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A value for players[i].user is required.'],
    autopopulate: true
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
}, options);

PlayerSchema.virtual('displayId').get(function() {
  let { seatPosition, hand, user, politicalRank } = this;
  const name = user.username;
  politicalRank = politicalRank ? politicalRank.value : 'no rank';
  return `${seatPosition} - ${name} - ${hand.length} cards - ${politicalRank} `;
});

PlayerSchema.plugin(require('mongoose-autopopulate'));

module.exports = PlayerSchema;