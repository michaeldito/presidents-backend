const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getInvites, getInvite } = require('../controller');

const inviteRouter = new Router({ prefix: '/invites' });
inviteRouter.get('/', Authenticate(['Admin']), getInvites);
inviteRouter.get('/:id', Authenticate(['Admin']), getInvite);

module.exports = inviteRouter;