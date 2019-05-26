const PlayerModel = require('../index');

async function setPlayersGame(playerId, gameId) {
  let playerDoc = await PlayerModel.findOne({_id: playerId});
  
}