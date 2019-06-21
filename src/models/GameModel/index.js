const mongoose = require('mongoose');
const PlayerModel = require('../PlayerModel');
const UserModel = require('../UserModel');
const GameConfigModel = require('../GameConfigModel');
const PoliticalRankModel = require('../PoliticalRankModel');
const RoundModel = require('../RoundModel');
const RankAssignmentModel = require('../RankAssignmentModel');
const utils = require('../../utils');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  currentRound: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round',
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
    seatPosition: this.players.length,
    drinksToDrink: 0,
    user,
    game: this,
  });
  
  this.players.push(player);
  await player.save();
  await this.save();

  return this.model('Game').findOne({name: this.name});
}



GameSchema.methods.startFirstRound = async function() {
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

  // get deck
  const config = await GameConfigModel.findOne({name: 'Presidents'}).populate('deck');
  
  // shuffle
  const shuffled = utils.shuffle(config.deck.cards);

  // deal
  const playerHands = utils.deal(this.players.length, shuffled).map(hand => utils.sortCards(hand));

  // assign cards based on seat position
  await this.players.forEach(async player => {
    let p = await PlayerModel.findById(player);
    p.hand = playerHands[p.seatPosition];
    await p.save();
  });
  
  // determine who has 3 clubs
  const [p, c] = utils.find3Clubs(playerHands);

  // player with seat position == p is current
  const playersInGame = await PlayerModel.find({'_id': { $in: this.players } });
  const currentPlayer = playersInGame.find(player => player.seatPosition === p);

  const nullRank = await PoliticalRankModel.getNullRank();

  let round;
  if (this.rounds.length === 0) { // first round
    round = new RoundModel({
      roundNumber: 1,
      currentPlayer,
      game: this,
      turns: []
    });
    rankInstances = [];
    for (let player of playersInGame) {
      const rank = new RankAssignmentModel({ politicalRank: nullRank, player, round });
      rankInstances.push(rank);
      player.rankAssignments.push(rank);
      await player.save();
      await rank.save();
    }
    round.rankAssignments = rankInstances;
  }

  this.currentRound = round;
  this.rounds.push(round);
  this.allowedRanks = await PoliticalRankModel.getRanks(this.players.length);

  await Promise.all([
    this.save(),
    round.save()
  ]);
  
  return this.model('Game').findOne({name: this.name});
}

GameSchema.methods.startNextRound = async function() {
  // validations
  // cannot start next round if game has no rounds
  // cannot start next round if game is finalized

  // get all rounds, find max round number, nextRound.roundNumber = that + 1
  
  // get deck, shuffle

  // find player who is asshole
  // begin dealing at asshole.seatPosition + 1
  // wrap around when idx == players.length

  // current player = player with 3 clubs

  // get ranks

  // create round

  // save
  
  // return game
}

GameSchema.methods.playerTakesTurn = async function(turn) {
  // validations
  // turn = { player, cards: [card], pass: Boolean }
  // cannot take turn if not players turn
  // cannot take turn if passing and have cards selected
  // turn.cards are not >= lastTurn.cards

  // does the turn cause skips?
  // create round
  // if turn causes skips, process skips
  // save turn(s)
  
  // add turn(s) to round, synchronously if > 1

  // if player has no more cards and only 1 other player has cards, round is finalized

  // set next player

  // save round
  
  // return game
}



const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;