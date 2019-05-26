const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }, 
  gameState: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameState',
    required: true
  },
  players: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Player',
    required: true
  },
  nextPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  deck: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card'
  },
  playedPile: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card'
  },
  discardPile: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card'
  },
  ranks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'PoliticalRank'
  }
});



const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;