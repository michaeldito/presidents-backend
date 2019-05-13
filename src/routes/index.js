const Router = require('koa-router');
const UserController = require('../controllers/User');
const GameController = require('../controllers/Game');
const Authentication = require('../controllers/Authentication');

// Public base api
const router = new Router({ prefix: '/api/v1' });
router.get('/', (ctx) => ctx.body = '/api/v1' );

// Login
const loginRouter = new Router({ prefix: '/login' });
loginRouter.post('/', Authentication);

// User
const userRouter = new Router({ prefix: '/users' });
userRouter.post('/create', UserController.create);

// Game
const gameRouter = new Router({ prefix: '/games' });
gameRouter.get('/', GameController.allGameNames);
gameRouter.post('/create', GameController.create);
gameRouter.put('/join', GameController.joinGame);


router.use(
  loginRouter.routes(),
  gameRouter.routes(),
  userRouter.routes()
);

module.exports = router;