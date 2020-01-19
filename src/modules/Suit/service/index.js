const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getAll, getOne } = require('../controller');

const suitRouter = new Router({ prefix: '/suits' });
suitRouter.get('/', Authenticate(['Admin']), getAll);
suitRouter.get('/:id', Authenticate(['Admin']), getOne);

module.exports = suitRouter;