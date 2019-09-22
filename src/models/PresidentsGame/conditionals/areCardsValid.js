module.exports = function(cards) {
  // is the current hand valid (all ranks the same)?
  const currentHandCardRankValues = cards.map(card => card.cardRank.value)
  const rankValue = currentHandCardRankValues[0];
  const areCardsValid = currentHandCardRankValues.every(cardRankValue => cardRankValue === rankValue);

  return areCardsValid ? true : false;
}