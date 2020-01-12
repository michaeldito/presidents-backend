const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { register, login, getUsers, getUser, profile } = require('../controller');

const userRouter = new Router({ prefix: '/users' });
userRouter.get('/',  getUsers);
userRouter.get('/:id', Authenticate(['Admin', 'Player']), getUser);
userRouter.get('/:id/profile', Authenticate(['Admin', 'Player']), profile);
userRouter.put('/login', login);
userRouter.post('/register', register);

module.exports = userRouter;