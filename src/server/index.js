require('../config/config');
const Koa = require('koa');
const api = require('../api');
const middleware = require('../middleware');
const db = require('../config/db');
const SocketIO = require('socket.io');
const http = require('http');

const app = new Koa();
const server = http.createServer(app.callback());
app.io = new SocketIO(server);

app.use(middleware);
app.use(api.routes(), api.allowedMethods());
app.on('error', (err, ctx) => { console.log(err) });
app.on('debug', (msg, ctx) => { console.log(msg) });

app.io.on('connection', client => {
  console.log(`[Socket] new client connected: ${client.id}`);
  client.on('disconnect', () => console.log('[Socket] client disconnected'));
});

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`[Server] listening on http port ${port}`));

db.connect();