const { GameStateModel, GameModel, PlayerModel } = require('../index');


// throws error or returns game doc
// creates game and updates player if successful
async function createGame(playerId, game) {
  
  const doc = await GameModel.findOne({name: game.name});
  if (doc) {
    throw new Error('A game with that name already exists.');
  }

  const NOT_STARTED = await GameStateModel.findOne({state: 'NOT_STARTED'});
  const newGame = new GameModel({
    name: game.name,
    state: NOT_STARTED._id,
    players: [playerId],
  });
  await newGame.save();

  // update the players document
  // set game & seat position
  let updatedPlayer = await PlayerModel.updateOne({_id: playerId}, {
    $set: {
      game: newGame._id,
      seatPosition: 0
    }
  });

  return newGame
}


// throws error or returns game doc
// updates game and player if successful
async function joinGame(playerId, gameId) {

  let game = await GameModel.findOne({_id: gameId});
  if (! game)
    throw new Error(`Game ${gameId} does not exist.`);

  // validations
  const alreadyJoined = await GameModel.findOne({ _id: gameId, players: { $all: [playerId] } });
  if (alreadyJoined)
    return game;

  const stateDoc = await GameStateModel.findOne({_id: game.state});
  if (stateDoc.state !== 'NOT_STARTED') 
    throw new Error('Unable to join. The game has already started.');

  if (game.players.length >= 8)
    throw new Error('Unable to join. Maximum number of players reached.');
    
  // add player to game
  game.players.push(playerId);
  await game.save();

  // add game to player
  let createdByPlayer = await PlayerModel.findOne({_id: playerId});
  createdByPlayer.game = game._id;

  // add seat position to player
  createdByPlayer.seatPosition = game.players.length - 1;
  await createdByPlayer.save();
  //console.log(`${playerId} seat position set to ${createdByPlayer.seatPosition}`);
  
  return game
}


// sets game status to in progress
// throws error or returns game doc
async function startGame(gameId) {
  const game = await GameModel.findOne({ _id: gameId });

  const IN_PROGRESS = await GameStateModel.findOne({state: 'IN_PROGRESS'});
  const FINALIZED = await GameStateModel.findOne({state: 'FINALIZED'});

  // validations
  if (game.status === IN_PROGRESS)
    throw new Error('Unable to start game. It is already in progress.');
  if (game.status === FINALIZED)
    throw new Error('Unable to start game. It has already finished.');
  if (game.players.length < 2)
    throw new Error('Unable to start game. Minimum number of players is 2.');

  // set status
  game.status = IN_PROGRESS;
  game.save();

  return game;
}

async function initializeGame(gameId) {
  // get game
  // if not in progress -> error
  // create deck
  //  get all 52 card ids
  //  shuffle card ids
  // deal to N players hands arrays
  // if no ranks -> assign in order
  // if ranks -> deal in circular pattern starting at asshole
  // determine what player has 3 of clubs
}

module.exports = {
  createGame,
  joinGame,
  startGame
}