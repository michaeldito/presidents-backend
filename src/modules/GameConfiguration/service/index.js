const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getAll, getOne } = require('../controller');

const gameConfigurationRouter = new Router({ prefix: '/gameConfigurations' });
gameConfigurationRouter.get('/', Authenticate(['Admin']), getAll);
gameConfigurationRouter.get('/:id', Authenticate(['Admin']), getOne);

module.exports = gameConfigurationRouter;