const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getPoliticalRanks, getPoliticalRank } = require('../controller');

const politicalRankRouter = new Router({ prefix: '/politicalRanks' });
politicalRankRouter.get('/', Authenticate(['Admin']), getPoliticalRanks);
politicalRankRouter.get('/:id', Authenticate(['Admin']), getPoliticalRank);

module.exports = politicalRankRouter;