const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const GameMembership = require('../../../middleware/GameMembership')
const { getAll, getOne, details, create, join, initialize, 
  processTurn, giveDrink, drinkDrink, rematch } = require('../controller');

const router = new Router({ prefix: '/presidents' });
router.get('/', getAll);
router.get('/:id', Authenticate(['Admin', 'Player']), getOne);
router.put('/:id/join', Authenticate(['Admin', 'Player']), join);
router.put('/:id/initialize', GameMembership, initialize);
router.put('/:id/processTurn', GameMembership, processTurn);
router.put('/:id/giveDrink', GameMembership, giveDrink);
router.put('/:id/drinkDrink', GameMembership, drinkDrink);
router.post('/:id/rematch', GameMembership, rematch);
router.get('/details', details);
router.post('/create', Authenticate(['Admin', 'Player']), create);

module.exports = router;