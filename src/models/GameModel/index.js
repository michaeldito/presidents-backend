const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }, 
  state: {
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
  lastCardHand: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card'
  },
  currentRoundCardPile: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card'
  },
  totalGameCardPile: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card'
  },
  ranksOfPlayers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'PoliticalRank'
  }
});

GameSchema.methods.toJSON = function () {
  return this.toObject();
}

GameSchema.statics.findByName = function(name) {
  return this.findOne({name});
}

const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;