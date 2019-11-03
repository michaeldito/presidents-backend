const Utils = require('../../../utils');

/**
 * 
 * 
 */
module.exports = async function(user) {
  console.log('[PresidentsGame@drinkDrink()]');
  // given that user has no drinks when they try to drink then bail out
  // given player does have drinks to drink when they try to drink
  // then drinksDrunk is incremented

  let player = this.players.find(player => player.user._id.toString() === user._id.toString());
  const { drinksReceived, drinksDrunk } = player;

  const hasDrinksToDrink = drinksReceived.length - drinksDrunk  === 0;
  console.log(`[PresidentsGame@drinkDrink()] hasDrinksToDrink ${hasDrinksToDrink}`);
  if (hasDrinksToDrink) {
    return Promise.reject(new Error('Unable to drink any drinks. User has none to drink.'));
  }

  player.drinksDrunk += 1;

  return this.save();
}