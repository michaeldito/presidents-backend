import Router from 'koa-router';

import Authenticate from '../middleware/Authenticate';
import * as Modules from '../modules';
const {
	Card,
	CardRank,
	Game,
	GameConfiguration,
	GameStatus,
	PoliticalRank,
	Presidents,
	Service,
	Status,
	Suit,
	User,
} = Modules;

const router = new Router({ prefix: '/api/v1' });

router.get('/', Service.Controller.description);
router.get('/json', Service.Controller.generateJSON);
router.post('/chat/token', Authenticate(['Admin', 'Player']), Service.Controller.chatToken);
router.post(
	'/video/token',
	Authenticate(['Admin', 'Player']),
	Service.Controller.videoToken,
);
router.get('/poop', ctx => {
	ctx.app.emit('logging', 'poop', ctx);
});
router.get('/logging', ctx => {
	ctx.body = require('../../debug.log');
});

const api = router.use(
	Card.Service.routes(),
	CardRank.Service.routes(),
	Game.Service.routes(),
	GameConfiguration.Service.routes(),
	GameStatus.Service.routes(),
	PoliticalRank.Service.routes(),
	Presidents.Service.routes(),
	Status.Service.routes(),
	Suit.Service.routes(),
	User.Service.routes(),
);

export default api;
