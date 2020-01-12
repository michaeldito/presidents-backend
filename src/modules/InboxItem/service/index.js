const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getInboxItems, getInboxItem } = require('../controller');

const inboxItemRouter = new Router({ prefix: '/inboxItems' });
inboxItemRouter.get('/', Authenticate(['Admin']), getInboxItems);
inboxItemRouter.get('/:id', Authenticate(['Admin']), getInboxItem);

module.exports = inboxItemRouter;