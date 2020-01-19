const Router = require('koa-router');
const Authenticate = require('../middleware/Authenticate');
const { card, cardRank, game, gameConfiguration, gameStatus, inboxItem, 
  invite, inviteStatus, politicalRank, presidents, service, status, suit, user } = require('../modules');

const router = new Router({ prefix: '/api/v1' });

router.get('/', service.description);
router.get('/json', service.generateJSON);
router.post('/chat/token', Authenticate(['Admin', 'Player']), service.chatToken);
router.post('/video/token', Authenticate(['Admin', 'Player']), service.videoToken);
router.get('/poop', ctx => { ctx.app.emit('logging', 'poop', ctx) });
router.get('/logging', ctx => { ctx.body = require('../../debug.log') });

const api = router.use(
  user.routes(),
  presidents.routes(),
  card.routes(),
  cardRank.routes(),
  game.routes(),
  gameConfiguration.routes(),
  gameStatus.routes(),
  inboxItem.routes(),
  invite.routes(),
  inviteStatus.routes(),
  politicalRank.routes(),
  status.routes(),
  suit.routes()
);

module.exports = api;