require('../config/config');

const Koa = require('koa');
const http = require('http');
const router = require('../routes');
const middleware = require('../middleware');

const app = new Koa();

app.use(middleware)
app.use(router.routes(), router.allowedMethods());

const server = http.createServer(app.callback());
server.listen(process.env.PORT, () => console.log(`[Server] listening on PORT ${process.env.PORT}`));

module.exports = server