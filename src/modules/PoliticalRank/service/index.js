const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getAll, getOne } = require('../controller');

const politicalRankRouter = new Router({ prefix: '/politicalRanks' });
politicalRankRouter.get('/', Authenticate(['Admin']), getAll);
politicalRankRouter.get('/:id', Authenticate(['Admin']), getOne);

module.exports = politicalRankRouter;