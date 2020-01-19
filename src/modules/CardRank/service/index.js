const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getAll, getOne } = require('../controller');

const cardRankRouter = new Router({ prefix: '/cardRanks' });
cardRankRouter.get('/', Authenticate(['Admin']), getAll);
cardRankRouter.get('/:id', Authenticate(['Admin']), getOne);

module.exports = cardRankRouter;