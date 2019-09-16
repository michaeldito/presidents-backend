const { 
  Card
} = require('../../');

module.exports = async function(cards) {
  // is the current hand valid (all ranks the same)?
  const currentHandCardRankValues = await Card.find({'cardRank.value': { $in: cards }});
  const rankValue = currentHandCardRankValues[0];
  const areCardsValid = currentHandCardRankValues.every(cardRankValue => cardRankValue === rankValue);
  return areCardsValid;
}