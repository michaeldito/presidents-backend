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

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;