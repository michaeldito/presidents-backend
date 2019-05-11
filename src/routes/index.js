const authentication = require('../authentication');
const Router = require('koa-router');
const UserController = require('../controllers/User');

// Public base api
const router = new Router({ prefix: '/api/v1' });
router.get('/', (ctx) => ctx.body = '/api/v1' );

// Login
const loginRouter = new Router({ prefix: '/login' });
loginRouter.get('/', authentication);

// User
const userRouter = new Router({ prefix: '/users' });
userRouter.post('/create', UserController.create);

// Game
const gameRouter = new Router({ prefix: '/game' });
gameRouter.get('/', (ctx) => ctx.body = '/api/v1/game');
gameRouter.post('/create', (ctx) => ctx.body = '/api/v1/game/create');
gameRouter.put('/join', (ctx) => ctx.body = '/api/v1/game/join');


router.use(
  loginRouter.routes(),
  gameRouter.routes(),
  userRouter.routes()
);

module.exports = router;