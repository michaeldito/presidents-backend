const Utils = require('../../../utils');
const { Card } = require('../..');

/**
 * 
 */
module.exports = async function(turn) {
  // 1 - is it this players turn?
  const isPlayersTurn = turn.user === this.currentPlayer;
  if (! isPlayersTurn)
    return Promise.reject(new Error(`Unable to process turn. It is not ${turn.user}\'s turn.`));

  // 2 - is the current hand valid (all ranks the same)?
  if (! this.areCardsValid(turn.cardsPlayed))
    return Promise.reject(new Error(`Unable to process turn. The cards selected are invalid.`));

  const handToBeatCardRankValues = await Card.find({'cardRank.value': { $in: this.handToBeat }});
  const currentHandCardRankValues = await Card.find({'cardRank.value': { $in: turn.cardsPlayed }});
  
  // 3 - is the current hand better?
  // case 1: current hand has more cards
  const currentHandHasMoreCards = handToBeatCardRankValues.length < currentHandCardRankValues.length
  if (currentHandHasMoreCards) {
    return Promise.resolve('more cards');
  }

  // case 2: current and previous hand have equal number of cards
  const equalNumberOfCards = handToBeatCardRankValues.length === currentHandCardRankValues.length;
  if (equalNumberOfCards) {

    // case2a: cards are of same rank
    const sameRank = handToBeatCardRankValues[0] === currentHandCardRankValues[0];
    if (sameRank) {
      return Promise.resolve('equal cards : same rank');
    }

    // case2b: current hand's card rank beats previous turns card rank
    const currentHandRankBeatsPrevious = currentHandCardRankValues[0] > handToBeatCardRankValues[0];
    if (currentHandRankBeatsPrevious) {
      return Promise.resolve('equal cards : better rank');
    }

    // case2c: current turn's rank does not beat previous turns rank
    else { 
      return Promise.reject(new Error(`Unable to process turn. The cards selected do not beat the previous hand.`));
    }
  }

  // case 3: current hand has fewer cards than previous hand
  // case 3a: if it contains a 2 it's a valid turn
  if (! currentHandCardRankValues.find(value => value === 2)) {
    return Promise.resolve('contains a 2');
  }

  // case 3b: if it does not contain a 2
  else {
    return Promise.reject(new Error(`Unable to process turn. Not enough cards have been selected to beat the previous hand.`));
  }
}