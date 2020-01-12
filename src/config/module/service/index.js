const Router = require('koa-router');
const { defaultGetNonsingular } = require('../controller');

const modelRouter = new Router({ prefix: '/model' });
modelRouter.get('/', defaultGetNonsingular);

module.exports = modelRouter;