const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  seatPosition: {
    type: Number
  },
  drinksToDrink: {
    type: Number
  },
  drinksDrunk: {
    type: Number
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  hand: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card',
  },
  rank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoliticalRank'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

PlayerSchema.statics.findAll = function() {
  return this.find({});
}

PlayerSchema.statics.findRandom = function() {
  return this.findOne({});
}

PlayerSchema.statics.findRandoms = function(howMany) {
  return this.find({}).limit(howMany);
}

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;