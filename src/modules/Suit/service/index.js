const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getSuits, getSuit } = require('../controller');

const suitRouter = new Router({ prefix: '/suits' });
suitRouter.get('/', Authenticate(['Admin']), getSuits);
suitRouter.get('/:id', Authenticate(['Admin']), getSuit);

module.exports = suitRouter;