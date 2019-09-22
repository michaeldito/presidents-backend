
module.exports = async function(currentPlayer, handToBeat, turn) {
  // console.log(`currentPlayer: ${currentPlayer}`)
  // console.log(`handToBeat: ${handToBeat}`)
  // console.log(`turn: ${turn}`)

  // 1 - is it this players turn?
  const isPlayersTurn = turn.user === currentPlayer;
  // console.log(`isPlayersTurn: ${isPlayersTurn}`)
  if (! isPlayersTurn)
    return Promise.reject(new Error(`Unable to process turn. It is not your turn.`));

  // 2 - is the current hand valid (all ranks the same)?
  const areCardsValid = this.areCardsValid(turn.cardsPlayed);
  // console.log(`areCardsValid: ${areCardsValid}`)
  if (! areCardsValid)
    return Promise.reject(new Error(`Unable to process turn. The cards selected are invalid.`));
  
  let shouldProcessTurn;
  try {
    shouldProcessTurn = await this.areCardsBetter(handToBeat, turn.cardsPlayed);
  } catch (err) {
    return Promise.reject(new Error(`Unable to process turn. The selected cards are not better. ${err.message}`));
  }

  // console.log(`shouldProcessTurn: ${shouldProcessTurn}`)
  if (shouldProcessTurn) {
    return Promise.resolve(true);
  }

  return Promise.reject(new Error('Unable to process turn. Not sure why.'));
}