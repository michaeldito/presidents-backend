module.exports = async function(cards) {
  // is the current hand valid (all ranks the same)?
  const currentHandCardRankValues = cards.map(card => card.cardRank.value)
  const rankValue = currentHandCardRankValues[0];
  const areCardsValid = currentHandCardRankValues.every(cardRankValue => cardRankValue === rankValue);

  if (areCardsValid) {
    return Promise.resolve(true);
  } 
  return Promise.reject(new Error('cards are not valid'));
}