require('../config/config');
const Koa = require('koa');
const router = require('../routes');
const middleware = require('../middleware');
const db = require('../config/db');

const app = new Koa();

app.use(middleware)
app.use(router.routes(), router.allowedMethods());
app.on('error', (err, ctx) => { console.log(err) });
app.on('debug', (msg, ctx) => { console.log(msg) });
app.listen(process.env.PORT, () => console.log(`[Server] listening on PORT ${process.env.PORT}`));

db.connect();