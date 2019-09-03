const { test: cardTests } = require('./Card/test');
const { test: cardRankTests } = require('./CardRank/test');
const { test: gameTests } = require('./Game/test');
const { test: gameConfigTests } = require('./GameConfiguration/test');
const { test: gameStatusTests } = require('./GameStatus/test');
const { test: inboxItemTests } = require('./InboxItem/test');
const { test: inviteTests } = require('./Invite/test');
const { test: inviteStatusTests } = require('./InviteStatus/test');
const { test: politicalRankTests } = require('./PoliticalRank/test');
const { test: presidentsTests } = require('./PresidentsGame/test');
const { test: statusTests } = require('./Status/test');
const { test: suitTests } = require('./Suit/test');
const { test: userTests } = require('./User/test');
const { test: warTests } = require('./WarGame/test');


module.exports.modelSuite = async () => {
  await suitTests();
  await cardRankTests();
  await cardTests();
  await gameConfigTests();
  await politicalRankTests();
  await statusTests();
  await gameStatusTests();
  await inboxItemTests();
  await inviteStatusTests();
  await inviteTests();
  await userTests();
  await gameTests();
  await presidentsTests();
  await warTests();
}

module.exports.models = {
  suitTests,
  cardRankTests,
  cardTests,
  gameConfigTests,
  politicalRankTests,
  statusTests,
  gameStatusTests,
  inboxItemTests,
  inviteStatusTests,
  inviteTests,
  userTests,
  gameTests,
  presidentsTests,
  warTests
}