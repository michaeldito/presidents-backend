const Utils = require('../../../utils');

/**
 * 
 * 
 */
module.exports = async function(fromUser, toUser) {
  // when player with user == fromUser gives player with user == toUser a drink
  // if toUser does not already have a drink to drink from fromPlayer
  // ie if toUser drinksDrunk !== drinksReceived.length
  // then grab the drinks player hasn't drunk
  // if one is from fromUser -> bail out
  // then add a drink to toUser drinksReceived
  // then add a drink to fromUser drinksSent

  if (1) {
    return Promise.reject(new Error(''));
  }

  return this.save();
}