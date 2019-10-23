const Utils = require('../../../utils');

module.exports = async function(turn) {
  console.log('[PresidentsGame@shouldProcessTurn()]');
  console.log(`[PresidentsGame@shouldProcessTurn()] currentPlayer: ${this.currentPlayer}`)
  console.log(`[PresidentsGame@shouldProcessTurn()] handToBeat: ${this.handToBeat.map(card => card.shortHand)}`)
  console.log(`[PresidentsGame@shouldProcessTurn()] turn: ${JSON.stringify(turn)}`)

  // 1 - is it this players turn?
  const isPlayersTurn = turn.user === this.currentPlayer.toString();
  console.log(`[PresidentsGame@shouldProcessTurn()] isPlayersTurn: ${isPlayersTurn}`)
  if (! isPlayersTurn)
    return Promise.reject(new Error(`Unable to process turn. It is not your turn.`));

  // 2 - is the current hand valid (all ranks the same)?
  const areCardsValid = Utils.areCardsValid(turn.cardsPlayed);
  console.log(`[PresidentsGame@shouldProcessTurn()] areCardsValid: ${areCardsValid}`)
  if (! areCardsValid)
    return Promise.reject(new Error(`Unable to process turn. The cards selected are invalid.`));
  
  // first turn of the game must contain 3 clubs
  if (! this.rounds.length === 1 && this.rounds[0].length === 0) {
    const contains3Clubs = turn.cardsPlayed.find(card => card.cardRank.shortHand === '3Clubs');
    if (contains3Clubs) {
      console.log('[PresidentsGame@shouldProcessTurn()] found 3 clubs on first hand of game')
      return Promise.resolve(true);
    }
    console.log('[PresidentsGame@shouldProcessTurn()] first turn of game is not 3 clubs')
    return Promise.reject(new Error('First turn of the game must be a 3 of clubs'));
  }

  // first turn of every other round can be anything
  if (this.rounds[this.rounds.length-1].length === 0) {
    console.log('[PresidentsGame@shouldProcessTurn()] first turn of any round can be whatever')
    return Promise.resolve(true);
  }
  
  // it's a turn in the middle of the round, see if it's better than the lastx
  let areCardsBetter;
  try {
    areCardsBetter = await Utils.areCardsBetter(this.handToBeat, turn.cardsPlayed);
    console.log(`[PresidentsGame@shouldProcessTurn()] areCardsBetter: ${areCardsBetter}`)

  } catch (err) {
    return Promise.reject(new Error(`Unable to process turn. The selected cards are not better. ${err.message}`));
  }

  console.log(`[PresidentsGame@shouldProcessTurn()] shouldProcessTurn: ${areCardsBetter}`)
  if (areCardsBetter) {
    return Promise.resolve(true);
  }

  return Promise.reject(new Error('Unable to process turn. Not sure why.'));
}