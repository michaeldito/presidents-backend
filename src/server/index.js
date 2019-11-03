require('../config/config');
const Koa = require('koa');
const router = require('../routes');
const middleware = require('../middleware');
const db = require('../config/db');
const socket = require('socket.io');
const http = require("http");

const app = new Koa();

const server = http.createServer(app.callback());

app.io = new socket(server);

app.use(middleware)
app.use(router.routes(), router.allowedMethods());
app.on('error', (err, ctx) => { console.log(err) });
app.on('debug', (msg, ctx) => { console.log(msg) });

app.io.on("connection", client => {
  console.log(`[Socket] new client connected: ${client.id}`);

  // A special namespace "disconnect" for when a client disconnects
  client.on("disconnect", () => console.log("[Socket] client disconnected"));
});

server.listen(process.env.PORT || 8080, () => console.log(`[Server] listening on http port ${process.env.PORT}`));

db.connect();