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
  console.log('[Presidents@giveDrink()]');

  let fromPlayer = this.players.find(player => player.user._id.equals(fromUser._id));
  let toPlayer = this.players.find(player => player.user._id.equals(toUser._id));

  if (! fromPlayer.toObject().hasOwnProperty('politicalRank') || ! toPlayer.toObject().hasOwnProperty('politicalRank')) {
    return Promise.reject(new Error('you must wait til all players have ranks to give drinks out'));
  }

  // President is #1, Vice President #2, etc. so rank is actually reversed
  const doesGiverOutRankReceiver = fromPlayer.politicalRank.value < toPlayer.politicalRank.value;
  console.log(`[Presidents@giveDrink()] doesGiverOutRankReceiver ${doesGiverOutRankReceiver}`);

  if (! doesGiverOutRankReceiver) {
    return Promise.reject(new Error('fromPlayer must out rank toPlayer in order to give a drink'));
  }

  const { drinksDrunk } = toPlayer;
  const doesReceiverHaveDrinksToDrink = toPlayer.drinksReceived.length - drinksDrunk;
  console.log(`[Presidents@giveDrink()] doesReceiverHaveDrinksToDrink ${doesReceiverHaveDrinksToDrink}`);
  if (doesReceiverHaveDrinksToDrink) {
    let drinksToDrink = toPlayer.drinksReceived.slice(drinksDrunk);
    console.log(drinksToDrink)
    console.log(fromUser)
    const doesReceiverAlreadyHaveADrinkFromGiver = drinksToDrink.find(drink => drink.sentBy.toString() === fromUser._id.toString());
    console.log(`[Presidents@giveDrink()] doesReceiverAlreadyHaveADrinkFromGiver ${doesReceiverAlreadyHaveADrinkFromGiver}`);
    if (doesReceiverAlreadyHaveADrinkFromGiver) {
      return Promise.reject(new Error('toPlayer already has a drink to drink from fromPlayer. you can\'t give another'));
    }
  }
  

  fromPlayer.drinksSent = fromPlayer.drinksSent.concat([{sentTo: toUser}]);
  toPlayer.drinksReceived = toPlayer.drinksReceived.concat([{sentBy: fromUser}]);

  return this.save();
}