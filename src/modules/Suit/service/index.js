const Router = require('koa-router');
const Authenticate = require('../../../middleware/Authenticate')
const { getAll, getOne } = require('../controller');

const router = new Router({ prefix: '/suits' });
router.get('/', Authenticate(['Admin']), getAll);
router.get('/:id', Authenticate(['Admin']), getOne);

module.exports = router;