const { GameStateModel, GameModel } = require('../index');

async function createGame(playerId, game) {
  const doc = await GameModel.findOne({name: game.name});
  if (doc) {
    throw new Error('A game with that name already exists.');
  }
  const NOT_STARTED = await GameStateModel.findOne({state: 'NOT_STARTED'});
  const newGame = new GameModel({
    name: game.name,
    gameState: NOT_STARTED._id,
    players: [playerId],
  });
  await newGame.save();
  return newGame
}

module.exports = {
  createGame
}