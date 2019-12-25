const Router = require('koa-router');
const ServiceController = require('../controllers/Service');
const UserController = require('../controllers/User');
const PresidentsController = require('../controllers/Presidents');
const CardController = require('../controllers/Card');
const CardRankController = require('../controllers/CardRank');
const GameController = require('../controllers/Game');
const GameConfigurationController = require('../controllers/GameConfiguration');
const GameStatusController = require('../controllers/GameStatus');
const InboxItemController = require('../controllers/InboxItem');
const InviteController = require('../controllers/Invite');
const InviteStatusController = require('../controllers/InviteStatus');
const PoliticalRankController = require('../controllers/PoliticalRank');
const StatusController = require('../controllers/Status');
const SuitController = require('../controllers/Suit');

const Authenticate = require('../middleware/Authenticate')
const GameMembership = require('../middleware/GameMembership')


const router = new Router({ prefix: '/api/v1' });
router.get('/', ServiceController.description);
router.post('/chat/token', Authenticate(['Admin', 'Player']), ServiceController.chatToken);
router.post('/video/token', Authenticate(['Admin', 'Player']), ServiceController.videoToken);
router.get('/poop', (ctx) => {
  ctx.app.emit('logging', 'poop', ctx);
});
router.get('/logging', (ctx) => {
  ctx.body = require('../../debug.log')
});

const userRouter = new Router({ prefix: '/users' });
userRouter.post('/register', UserController.register);
userRouter.put('/login', UserController.login);
userRouter.get('/',  UserController.getUsers);
userRouter.get('/:id', Authenticate(['Admin', 'Player']), UserController.getUser);
userRouter.get('/:id/profile', Authenticate(['Admin', 'Player']), UserController.profile);

const presidentsRouter = new Router({ prefix: '/presidents' });
presidentsRouter.get('/', PresidentsController.briefDetails);
presidentsRouter.post('/create', Authenticate(['Admin', 'Player']), PresidentsController.create);
presidentsRouter.get('/:id', Authenticate(['Admin', 'Player']), PresidentsController.gameDetails);
presidentsRouter.put('/:id/join', Authenticate(['Admin', 'Player']), PresidentsController.join);
presidentsRouter.put('/:id/initialize', GameMembership, PresidentsController.initialize);
presidentsRouter.put('/:id/processTurn', GameMembership,PresidentsController.processTurn);
presidentsRouter.put('/:id/giveDrink', GameMembership, PresidentsController.giveDrink);
presidentsRouter.put('/:id/drinkDrink', GameMembership, PresidentsController.drinkDrink);
presidentsRouter.post('/:id/rematch', GameMembership, PresidentsController.rematch);

const cardRouter = new Router({ prefix: '/cards' });
cardRouter.get('/', Authenticate(['Admin']), CardController.getCards);
cardRouter.get('/:id', Authenticate(['Admin']), CardController.getCard);

const cardRankRouter = new Router({ prefix: '/cardRanks' });
cardRankRouter.get('/', Authenticate(['Admin']), CardRankController.getCardRanks);
cardRankRouter.get('/:id', Authenticate(['Admin']), CardRankController.getCardRank);

const gameRouter = new Router({ prefix: '/games' });
gameRouter.get('/', Authenticate(['Admin']), GameController.getGames);
gameRouter.get('/:id', Authenticate(['Admin']), GameController.getGame);

const gameConfigurationRouter = new Router({ prefix: '/gameConfigurations' });
gameConfigurationRouter.get('/', Authenticate(['Admin']), GameConfigurationController.getGameConfigurations);
gameConfigurationRouter.get('/:id', Authenticate(['Admin']), GameConfigurationController.getGameConfiguration);

const gameStatusRouter = new Router({ prefix: '/gameStatuses' });
gameStatusRouter.get('/', Authenticate(['Admin']), GameStatusController.getGameStatuses);
gameStatusRouter.get('/:id', Authenticate(['Admin']), GameStatusController.getGameStatus);

const inboxItemRouter = new Router({ prefix: '/inboxItems' });
inboxItemRouter.get('/', Authenticate(['Admin']), InboxItemController.getInboxItems);
inboxItemRouter.get('/:id', Authenticate(['Admin']), InboxItemController.getInboxItem);

const inviteRouter = new Router({ prefix: '/invites' });
inviteRouter.get('/', Authenticate(['Admin']), InviteController.getInvites);
inviteRouter.get('/:id', Authenticate(['Admin']), InviteController.getInvite);

const inviteStatusRouter = new Router({ prefix: '/inviteStatuses' });
inviteStatusRouter.get('/', Authenticate(['Admin']), InviteStatusController.getInviteStatuses);
inviteStatusRouter.get('/:id', Authenticate(['Admin']), InviteStatusController.getInviteStatus);

const politicalRankRouter = new Router({ prefix: '/politicalRanks' });
politicalRankRouter.get('/', Authenticate(['Admin']), PoliticalRankController.getPoliticalRanks);
politicalRankRouter.get('/:id', Authenticate(['Admin']), PoliticalRankController.getPoliticalRank);

const statusRouter = new Router({ prefix: '/statuses' });
statusRouter.get('/', Authenticate(['Admin']), StatusController.getStatuses);
statusRouter.get('/:id', Authenticate(['Admin']), StatusController.getStatus);

const suitRouter = new Router({ prefix: '/suits' });
suitRouter.get('/', Authenticate(['Admin']), SuitController.getSuits);
suitRouter.get('/:id', Authenticate(['Admin']), SuitController.getSuit);

router.use(
  userRouter.routes(),
  presidentsRouter.routes(),
  cardRouter.routes(),
  cardRankRouter.routes(),
  gameRouter.routes(),
  gameConfigurationRouter.routes(),
  gameStatusRouter.routes(),
  inboxItemRouter.routes(),
  inviteRouter.routes(),
  inviteStatusRouter.routes(),
  politicalRankRouter.routes(),
  statusRouter.routes(),
  suitRouter.routes()
);

module.exports = router;