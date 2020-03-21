import Router from 'koa-router';

import Authenticate from '../../../middleware/Authenticate';
import GameMembership from '../../../middleware/GameMembership';
import {
	create,
	details,
	drinkDrink,
	getAll,
	getOne,
	giveDrink,
	initialize,
	join,
	processTurn,
	rematch,
} from '../controller';

const router = new Router({ prefix: '/presidents' });
router.get('/', getAll);
router.get('/details', Authenticate(['Admin', 'Player']), details);
router.post('/create', Authenticate(['Admin', 'Player']), create);
router.get('/:id', Authenticate(['Admin', 'Player']), getOne);
router.put('/:id/join', Authenticate(['Admin', 'Player']), join);
router.put('/:id/initialize', GameMembership, initialize);
router.put('/:id/processTurn', GameMembership, processTurn);
router.put('/:id/giveDrink', GameMembership, giveDrink);
router.put('/:id/drinkDrink', GameMembership, drinkDrink);
router.post('/:id/rematch', GameMembership, rematch);

export default router;
