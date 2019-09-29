const Utils = require('../../../utils');

/**
 * 
 * 
 */
module.exports = async function(fromUser, toUser) {
  // given that fromUser out ranks toUser
  // and toUser does not already have a drink to drink from fromUser
  // then a drinkReceived will be added to toUser
  // and a drinkSent will be added to fromUser

  let fromPlayer = this.players.find(player => player.user.toString() === fromUser.toString());
  let toPlayer = this.players.find(player => player.user.toString() === toUser.toString());
  
  if (! fromPlayer.toObject().hasOwnProperty('politicalRank') || ! toPlayer.toObject().hasOwnProperty('politicalRank')) {
    return Promise.reject(new Error('you must wait til all players have ranks to give drinks out'));
  }

  // President is #1, Vice President #2, etc. so rank is actually reversed
  const doesGiverOutRankReceiver = fromPlayer.politicalRank.value < toPlayer.politicalRank.value;
  
  if (! doesGiverOutRankReceiver) {
    return Promise.reject(new Error('fromPlayer must out rank toPlayer in order to give a drink'));
  }

  fromPlayer.drinksSent.push({sentTo: toUser});
  toPlayer.drinksReceived.push({sentBy: fromUser});

  return this.save();
}