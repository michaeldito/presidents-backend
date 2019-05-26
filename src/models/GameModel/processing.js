const { GameStateModel, GameModel, PlayerModel } = require('../index');

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
  let createdByPlayer = await PlayerModel.findOne({_id: playerId});
  createdByPlayer.game = newGame._id;
  await createdByPlayer.save();

  return newGame
}



async function joinGame(playerId, gameId) {

  const game = await GameModel.findOne({_id: gameId});
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

  // update the players document
  let createdByPlayer = await PlayerModel.findOne({_id: playerId});
  createdByPlayer.game = game._id;
  await createdByPlayer.save();
  
  // return gameId
  return game
}

async function startGame(game) {
  const doc = await GameModel.findOne({name: game.name});
  // validations
  // set game status to in progress
  // shuffle deck, assign cards, check ranks, if asshole start there, else 0->
  // 
}
module.exports = {
  createGame,
  joinGame
}