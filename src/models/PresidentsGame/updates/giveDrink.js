const Utils = require('../../../utils');

/**
 * Preconditions: The userIds for fromUser and toUser are associated with players in the game.
 * 
 * Algorithm:
 *  1. Get the two players in the game.
 *  2. If either of them doesn't have the politicalRank property, it's the first round and no one has a rank
 *     so don't allow a drink to be given.
 *  3. Otherwise check if the drink giver has a better rank than the drink receiver. 
 *  4. If they do, check if the receiver has a drink to drink from the giver.
 *  5. If they have a drink to drink then reject, because you can't stack drinks.
 *  6. If they don't update fromPlayer.drinksSent and toPlayer.drinksReceived.
 *  7. Save and return.
 */
module.exports = async function(fromUser, toUser) {
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

  const { drinksDrunk } = toPlayer;
  const doesReceiverHaveDrinksToDrink = toPlayer.drinksReceived.length - drinksDrunk;
  if (doesReceiverHaveDrinksToDrink) {
    let drinksToDrink = toPlayer.drinksReceived.slice(drinksDrunk);
    const doesReceiverAlreadyHaveADrinkFromGiver = drinksToDrink.find(drink => drink.sentBy.toString() === fromUser.toString());
    if (doesReceiverAlreadyHaveADrinkFromGiver) {
      return Promise.reject(new Error('toPlayer already has a drink to drink from fromPlayer. you can\'t give another'));
    }
  }
  

  fromPlayer.drinksSent.push({sentTo: toUser});
  toPlayer.drinksReceived.push({sentBy: fromUser});

  return this.save();
}