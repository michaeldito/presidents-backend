const { test: cardTests } = require('./Card/model/test');
const { test: cardRankTests } = require('./CardRank/model/test');
const { test: gameTests } = require('./Game/model/test');
const { test: gameConfigTests } = require('./GameConfiguration/model/test');
const { test: gameStatusTests } = require('./GameStatus/model/test');
const { test: inboxItemTests } = require('./InboxItem/model/test');
const { test: inviteTests } = require('./Invite/model/test');
const { test: inviteStatusTests } = require('./InviteStatus/model/test');
const { test: politicalRankTests } = require('./PoliticalRank/model/test');
const { test: presidentsTests } = require('./Presidents/model/test');
const { test: statusTests } = require('./Status/model/test');
const { test: suitTests } = require('./Suit/model/test');
const { test: userTests } = require('./User/model/test');


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
  
}