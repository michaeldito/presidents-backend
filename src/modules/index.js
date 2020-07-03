const { Service: card } = require('./Card');
const { Service: cardRank } = require('./CardRank');
const { Service: game } = require('./Game');
const { Service: gameConfiguration } = require('./GameConfiguration');
const { Service: gameStatus } = require('./GameStatus');
const { Service: inboxItem } = require('./InboxItem');
const { Service: invite } = require('./Invite');
const { Service: inviteStatus } = require('./InviteStatus');
const { Service: politicalRank } = require('./PoliticalRank');
const { Service: presidents } = require('./Presidents');
const service = require('./Service');
const { Service: status } = require('./Status');
const { Service: suit } = require('./Suit');
const { Service: user } = require('./User');

/**
 * ? not sure
 * ! o no
 * TODO: shit
 * @param poop it stinks
 */

module.exports = { 
  card,
  cardRank,
  game,
  gameConfiguration,
  gameStatus,
  inboxItem,
  invite,
  inviteStatus,
  politicalRank,
  presidents,
  service,
  status,
  suit,
  user
}
