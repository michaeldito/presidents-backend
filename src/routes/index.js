const Router = require('koa-router');

// Public base api
const router = new Router({ prefix: '/api/v1' });

router.get('/', (ctx) => {
  ctx.body = {data: '/api/v1'};
  ctx.status = 200;
});

router.get('/error', (ctx) => {
  ctx.throw(400, 'Error Message');
});

router.get('/no-way', (ctx) => {
  ctx.app.emit('no way', 'poop', ctx);
});


// router.use(
//   loginRouter.routes(),
//   gameRouter.routes(),
//   userRouter.routes()
// );

module.exports = router;