const mongoose = require('mongoose');
const PlayerModel = require('../PlayerModel');
const UserModel = require('../UserModel');
const GameConfigModel = require('../GameConfigModel');
const PoliticalRankModel = require('../PoliticalRankModel');
const RoundModel = require('../RoundModel');
const RankAssignmentModel = require('../RankAssignmentModel');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  players: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Player',
    required: true
  },
  allowedRanks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'PoliticalRank'
  },
  rounds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Round'
  },
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
  // begin validations

  if (! user) {
    throw new Error('Missing argument, user is required.');
  }

  // 1 - game has started
  if (this.rounds.length) {
    throw new Error('Cannot join game. It is already in progress.');
  }

  // 2 - max players reached
  const gameConfig = await GameConfigModel.findById(this.gameConfig);
  if (this.players.length >= gameConfig.maxPlayers) {
    throw new Error('Cannot join game. It is already full.');
  }

  // 3 - player is already in the game
  for (let player of this.players) {
    const playerDoc = await PlayerModel.findById(player);
    const existingUserDoc = await UserModel.findById(playerDoc.user);

    // console.log(`${existingUserDoc._id} == ${user._id} ?`)
    if (existingUserDoc._id.toString() === user._id.toString()) {
    // if (existingUserDoc._id === user._id) {
        // console.log('true')
      throw new Error('User has already joined game.');
    }
  }


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

  return this.model('Game').findOne({name: this.name});
}



GameSchema.methods.start = async function() {
  // validations
  // 1 - Unable to start game. It is already in progress.
  if (this.rounds.length > 0) {
    throw new Error('Unable to start game. It is already in progress.');
  }
  // 2 - Unable to start game. It has already finished.
  if (this.finalized) {
    throw new Error('Unable to start game. It has already finished.');
  }
  // 3 - Unable to start game. Minimum number of players is 2.
  if (this.players.length < 2) {
    throw new Error('Unable to start game. Minimum number of players is 2.');
  }

  this.allowedRanks = await PoliticalRankModel.getRanks(this.players.length);
  const nullRank = await PoliticalRankModel.getNullRank();
  const playerWith3Clubs = await PlayerModel.find3ClubsForGame(this);

  let round;
  let rankAssignments;
  if (this.rounds.length === 0) { // first round
    round = new RoundModel({
      roundNumber: 1,
      currentPlayer: playerWith3Clubs,
      game: this,
      turns: []
    });
    rankAssignments = this.players.map(player => {
      return RankAssignmentModel({
        politicalRank: nullRank,
        player: player,
        round
      })
    });
    round.rankAssignments = rankAssignments;
  }
  this.rounds.push(round);

  await Promise.all([
    this.save(),
    round.save(), 
    ...rankAssignments
  ]);
  
  return this.model('Game').findOne({name: this.name});
}


const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;