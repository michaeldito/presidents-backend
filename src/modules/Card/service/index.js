const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate');
const { getCards, getCard } = require('../controller');

const cardRouter = new Router({ prefix: '/cards' });
cardRouter.get('/', Authenticate(['Admin']), getCards);
cardRouter.get('/:id', Authenticate(['Admin']), getCard);

module.exports = cardRouter;