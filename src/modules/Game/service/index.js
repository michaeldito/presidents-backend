const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getGames, getGame } = require('../controller');

const gameRouter = new Router({ prefix: '/games' });
gameRouter.get('/', Authenticate(['Admin']), getGames);
gameRouter.get('/:id', Authenticate(['Admin']), getGame);

module.exports = gameRouter;