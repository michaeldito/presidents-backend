const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getAll, getOne } = require('../controller');

const inviteStatusRouter = new Router({ prefix: '/inviteStatuses' });
inviteStatusRouter.get('/', Authenticate(['Admin']), getAll);
inviteStatusRouter.get('/:id', Authenticate(['Admin']), getOne);

module.exports = inviteStatusRouter;