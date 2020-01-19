const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const VerifyJWT = require('../../../middleware/VerifyJWT');
const { register, login, getAll, getOne, profile } = require('../controller');

const router = new Router({ prefix: '/users' });
router.use(VerifyJWT);
router.get('/',  getAll);
router.get('/:id', Authenticate(['Admin', 'Player']), getOne);
router.get('/:id/profile', Authenticate(['Admin', 'Player']), profile);
router.put('/login', login);
router.post('/register', register);

module.exports = router;