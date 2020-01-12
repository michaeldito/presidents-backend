const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getCardRanks, getCardRank } = require('../controller');

const cardRankRouter = new Router({ prefix: '/cardRanks' });
cardRankRouter.get('/', Authenticate(['Admin']), getCardRanks);
cardRankRouter.get('/:id', Authenticate(['Admin']), getCardRank);

module.exports = cardRankRouter;