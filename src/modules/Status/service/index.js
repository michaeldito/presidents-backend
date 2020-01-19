const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getAll, getOne } = require('../controller');

const statusRouter = new Router({ prefix: '/statuses' });
statusRouter.get('/', Authenticate(['Admin']), getAll);
statusRouter.get('/:id', Authenticate(['Admin']), getOne);

module.exports = statusRouter;