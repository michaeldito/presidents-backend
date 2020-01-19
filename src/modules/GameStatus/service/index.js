const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getAll, getOne } = require('../controller');

const gameStatusRouter = new Router({ prefix: '/gameStatuses' });
gameStatusRouter.get('/', Authenticate(['Admin']), getAll);
gameStatusRouter.get('/:id', Authenticate(['Admin']), getOne);

module.exports = gameStatusRouter;