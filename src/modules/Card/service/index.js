const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate');
const { getAll, getOne } = require('../controller');

const cardRouter = new Router({ prefix: '/cards' });
cardRouter.get('/', Authenticate(['Admin']), getAll);
cardRouter.get('/:id', Authenticate(['Admin']), getOne);

module.exports = cardRouter;