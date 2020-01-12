const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getStatuses, getStatus } = require('../controller');

const statusRouter = new Router({ prefix: '/statuses' });
statusRouter.get('/', Authenticate(['Admin']), getStatuses);
statusRouter.get('/:id', Authenticate(['Admin']), getStatus);

module.exports = statusRouter;