const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  players: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Player',
    required: true
  },
  allowedRanks: {
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

GameSchema.statics.create = async function(playerId, {name}) {
  const doc = await this.findOne({name});
  if (doc) {
    throw new Error('A game with that name already exists.');
  }

  // init game

  // update the players document
  // set game & seat position


  return newGame
}

GameSchema.statics.addPlayer = async function(playerId, gameId) {
  let gameWithId = await this.findOne({_id: gameId});
  if (! gameWithId)
    throw new Error(`Game ${gameId} does not exist.`);

  // begin validations
  // 1 - player is already in the game, return it

  // 2 - game has invalid status, throw err

  // 3 - game has ,ax players, throw err

  // end validations
  
  // add player to game & save

  // add game to player


  // add seat position to player & save


  return game
}

GameSchema.statics.startGame = async function(gameId) {
  // validations
  // 1 - Unable to start game. It is already in progress.
  // 2 - Unable to start game. It has already finished.
  // 3 - Unable to start game. Minimum number of players is 2.
}

const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;