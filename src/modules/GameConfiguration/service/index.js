const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getGameConfigurations, getGameConfiguration } = require('../controller');

const gameConfigurationRouter = new Router({ prefix: '/gameConfigurations' });
gameConfigurationRouter.get('/', Authenticate(['Admin']), getGameConfigurations);
gameConfigurationRouter.get('/:id', Authenticate(['Admin']), getGameConfiguration);

module.exports = gameConfigurationRouter;