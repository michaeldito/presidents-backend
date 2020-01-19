const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const GameMembership = require('../../../middleware/GameMembership')
const { getAll, getOne, details, create, join, initialize, 
  processTurn, giveDrink, drinkDrink, rematch } = require('../controller');

const presidentsRouter = new Router({ prefix: '/presidents' });
presidentsRouter.get('/', getAll);
presidentsRouter.get('/:id', Authenticate(['Admin', 'Player']), getOne);
presidentsRouter.put('/:id/join', Authenticate(['Admin', 'Player']), join);
presidentsRouter.put('/:id/initialize', GameMembership, initialize);
presidentsRouter.put('/:id/processTurn', GameMembership, processTurn);
presidentsRouter.put('/:id/giveDrink', GameMembership, giveDrink);
presidentsRouter.put('/:id/drinkDrink', GameMembership, drinkDrink);
presidentsRouter.post('/:id/rematch', GameMembership, rematch);
presidentsRouter.get('/details', details);
presidentsRouter.post('/create', Authenticate(['Admin', 'Player']), create);

module.exports = presidentsRouter;