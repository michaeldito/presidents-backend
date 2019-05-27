require('../config/config');
require('dotenv').config();


const Koa = require('koa');
const http = require('http');
const router = require('../routes');
const compose = require('koa-compose');
const middleware = require('../middleware');

const app = new Koa();
app.use(compose(middleware));

app.on('error', (err, ctx) => {
 console.log('woah!');
});

app.addListener('no way', (ctx) => {
  console.log('holy shit');
});

app.use(router.routes(), router.allowedMethods());

const server = http.createServer(app.callback());
server.listen(process.env.PORT, () => console.log(`[Server] listening on PORT ${process.env.PORT}`));

module.exports = server