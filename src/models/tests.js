const { test: cardTests } = require('./Card/test');
const { test: cardRankTests } = require('./CardRank/test');
const { test: gameTests } = require('./Game/test');
const { test: gameConfigTests } = require('./GameConfiguration/test');
const { test: politicalRankTests } = require('./PoliticalRank/test');
const { test: presidentsTests } = require('./PresidentsGame/test');
const { test: suitTests } = require('./Suit/test');
const { test: userTests } = require('./User/test');
const { test: warTests } = require('./WarGame/test');


module.exports.modelTests = async () => {
  await suitTests();
  await cardRankTests();
  await cardTests();
  await gameConfigTests();
  await politicalRankTests();
  await userTests();
  await gameTests();
  await presidentsTests();
  await warTests();
}