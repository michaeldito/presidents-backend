const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getAll, getOne } = require('../controller');

const gameRouter = new Router({ prefix: '/games' });
gameRouter.get('/', Authenticate(['Admin']), getAll);
gameRouter.get('/:id', Authenticate(['Admin']), getOne);

module.exports = gameRouter;