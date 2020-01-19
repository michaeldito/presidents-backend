const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getAll, getOne } = require('../controller');

const inviteRouter = new Router({ prefix: '/invites' });
inviteRouter.get('/', Authenticate(['Admin']), getAll);
inviteRouter.get('/:id', Authenticate(['Admin']), getOne);

module.exports = inviteRouter;