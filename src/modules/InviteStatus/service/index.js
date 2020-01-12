const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getInviteStatuses, getInviteStatus } = require('../controller');

const inviteStatusRouter = new Router({ prefix: '/inviteStatuses' });
inviteStatusRouter.get('/', Authenticate(['Admin']), getInviteStatuses);
inviteStatusRouter.get('/:id', Authenticate(['Admin']), getInviteStatus);

module.exports = inviteStatusRouter;