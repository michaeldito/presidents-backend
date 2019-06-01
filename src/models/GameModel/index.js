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

GameSchema.statics.setGameState = async function (name, state) {
  const stateDoc = this.model('GameState').findOne({state});
  return this.findOneAndUpdate({name}, {state: stateDoc._id});
}

GameSchema.statics.findByName = function(name) {
  return this.findOne({name});
}

GameSchema.statics.create = async function(playerId, {name}) {
  const doc = await this.findOne({name});
  if (doc) {
    throw new Error('A game with that name already exists.');
  }

  const NOT_STARTED = await this.model('GameState').findOne({state: 'NOT_STARTED'});
  const newGame = new GameModel({
    name: name,
    state: NOT_STARTED._id,
    players: [playerId],
  });
  await newGame.save();

  // update the players document
  // set game & seat position
  let updatedPlayer = await this.model('Player').updateOne({_id: playerId}, {
    $set: {
      game: newGame._id,
      seatPosition: 0
    }
  });

  return newGame
}

GameSchema.statics.addPlayer = async function(playerId, gameId) {
  let gameWithId = await this.findOne({_id: gameId});
  if (! gameWithId)
    throw new Error(`Game ${gameId} does not exist.`);

  // begin validations
  // 1 - player is already in the game, return it
  const gameWithPlayer = await this.findOne({ _id: gameId, players: { $all: [playerId] } });
  if (gameWithPlayer)
    return gameWithPlayer;

  // 2 - game has invalid status, throw err
  let game = await this.findOne({ _id: gameId }).populate('state');
  if (game.state.state !== 'NOT_STARTED') 
    throw new Error('Unable to join. The game has already started.');

  // 3 - game has ,ax players, throw err
  if (game.players.length >= 8)
    throw new Error('Unable to join. Maximum number of players reached.');
  // end validations
  
  // add player to game
  game.players.push(playerId);
  await game.save();

  // add game to player
  let player = await this.model('Player').findOne({_id: playerId});
  player.game = game._id;

  // add seat position to player
  player.seatPosition = game.players.length - 1;
  await player.save();

  return game
}

GameSchema.statics.startGame = async function(gameId) {
  const game = await this.findOne({ _id: gameId }).populate('state');

  if (game.state.state === 'IN_PROGRESS')
    throw new Error('Unable to start game. It is already in progress.');
  if (game.state.state === 'FINALIZED')
    throw new Error('Unable to start game. It has already finished.');
  if (game.players.length < 2)
    throw new Error('Unable to start game. Minimum number of players is 2.');

  const inProgress = await this.model('GameState').findByState('IN_PROGRESS');
  game.status = inProgress._id;
  game.save();

  return game;
}

const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;