const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getAll, getOne } = require('../controller');

const inboxItemRouter = new Router({ prefix: '/inboxItems' });
inboxItemRouter.get('/', Authenticate(['Admin']), getAll);
inboxItemRouter.get('/:id', Authenticate(['Admin']), getOne);

module.exports = inboxItemRouter;