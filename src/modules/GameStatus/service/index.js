const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getGameStatuses, getGameStatus } = require('../controller');

const gameStatusRouter = new Router({ prefix: '/gameStatuses' });
gameStatusRouter.get('/', Authenticate(['Admin']), getGameStatuses);
gameStatusRouter.get('/:id', Authenticate(['Admin']), getGameStatus);

module.exports = gameStatusRouter;