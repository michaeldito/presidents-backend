const mongoose = require('mongoose');
const PlayerModel = require('../PlayerModel/index');
const UserModel = require('../UserModel/index');
const GameConfigModel = require('../GameConfigModel/index');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  }],
  allowedRanks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoliticalRank'
  }],
  rounds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round'
  }],
  gameConfig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameConfig',
    required: true
  }
});

GameSchema.methods.toJSON = function () {
  return this.toObject();
}


GameSchema.statics.findByName = function(name) {
  return this.findOne({name});
}

// Controller should check that game name is not a duplicate
/*
 * Creates a new game.
 * @param user: A User object. The user who is creating the game.
 *
 */
GameSchema.statics.create = async function(user, {name}, gameConfig) {
  let player = new PlayerModel({
    seatPosition: 0,
    drinksToDrink: 0,
    user
  });

  let newGame = new GameModel({
    name,
    players: [player],
    gameConfig
  });
  
  player.game = newGame;

  await Promise.all([newGame.save(), player.save()]);

  return this.findOne({name});
}


/*
 * Adds a new player to the game.
 * @param user: A User object, the user joining the game. 
 */
GameSchema.methods.addPlayer = async function(user) {
  let error = false;
  // begin validations
  // 1 - player is already in the game, return it
  let gameConfig = await GameConfigModel.findById(this.gameConfig);

  for (let playerId of this.players) {
    let player = await PlayerModel.findById(playerId);
    let existingUser = await UserModel.findById(player.user);

    if (existingUser._id === user._id) {
      error = new Error('User has already joined game.');
    }

  }
  if (!error && this.rounds.length) {
    error = new Error('Cannot join game. It is already in progress.');
  }
  // 3 - game has max players, throw err
  // end validations
  if (!error && this.players.length >= gameConfig.maxPlayers) {
    error = new Error('Cannot join game. It is already full.');
  }
  
  if (error) {
    return error;
  }
  else {
    // add player to game & save
    let player = new PlayerModel({
      seatPosition: 0,
      drinksToDrink: 0,
      user,
      game: this,
    });
    
    this.players.push(player);
    await player.save();
    await this.save();

    return this.toObject();
  }
}



GameSchema.statics.startGame = async function(gameId) {
  // validations
  // 1 - Unable to start game. It is already in progress.
  // 2 - Unable to start game. It has already finished.
  // 3 - Unable to start game. Minimum number of players is 2.
}

const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;