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
  const areCardsValid = await this.areCardsValid(turn.cardsPlayed);
  if (! areCardsValid)
    return Promise.reject(new Error(`Unable to process turn. The cards selected are invalid.`));
  
  const shouldProcessTurn = await this.areCardsBetter(turn.cardsPlayed);
  if (shouldProcessTurn) {
    return Promise.resolve(true);
  }

  return Promise.reject('Unable to process turn. The selected cards are not better.');
}