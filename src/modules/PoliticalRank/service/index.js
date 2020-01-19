const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const VerifyJWT = require('../../../middleware/VerifyJWT');
const { getAll, getOne } = require('../controller');

const router = new Router({ prefix: '/politicalRanks' });
router.use(VerifyJWT);
router.get('/', Authenticate(['Admin']), getAll);
router.get('/:id', Authenticate(['Admin']), getOne);

module.exports = router;