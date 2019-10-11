const Router = require('koa-router');
const UserController = require('../controllers/User');
const PresidentsController = require('../controllers/Presidents');
const { VerifyJWT, Authenticate } = require('../middleware/')


// Public base api
const router = new Router({ prefix: '/api/v1' });

router.get('/', (ctx) => {
  ctx.body = {data: '/api/v1'};
  ctx.status = 200;
});

router.get('/error', (ctx) => {
  ctx.throw(400, 'Error Message');
});

router.get('/poop', (ctx) => {
  ctx.app.emit('logging', 'poop', ctx);
});

router.get('/logging', (ctx) => {
  ctx.body = require('../../debug.log')
});

const userRouter = new Router({ prefix: '/users' });
userRouter.post('/register', UserController.register);
userRouter.put('/login', UserController.login);
userRouter.get('/:id/profile', UserController.profile);

const presidentsRouter = new Router({ prefix: '/presidents' });

//presidentsRouter.use(VerifyJWT);
presidentsRouter.get('/', PresidentsController.briefDetails);
presidentsRouter.post('/create', PresidentsController.create);
presidentsRouter.get('/:id', PresidentsController.gameDetails);
presidentsRouter.put('/:id/join', PresidentsController.join);
presidentsRouter.put('/:id/initialize', PresidentsController.initialize);
presidentsRouter.put('/:id/processTurn', PresidentsController.processTurn);
presidentsRouter.put('/:id/giveDrink', PresidentsController.giveDrink);
presidentsRouter.put('/:id/drinkDrink', PresidentsController.drinkDrink);
presidentsRouter.post('/:id/rematch', PresidentsController.rematch);

router.use(
  userRouter.routes(),
  presidentsRouter.routes()
);

module.exports = router;