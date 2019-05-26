const { GameModel, GameStateModel } = require('../models');

const createGame = async (playerId, game) => {
  const nameTaken = await GameModel.findOne({name: game.name});
  if (nameTaken) {
    return new Error('A game with that name already exists.');
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
