import config from '../config/config';
config();

import http from 'http';
import Koa from 'koa';
import SocketIO from 'socket.io';

import api from '../api';
import { connect } from '../config/db';
import logger from '../config/logger';
import middleware from '../middleware';

const app = new Koa();
const server = http.createServer(app.callback());
app.io = new SocketIO(server);
app.use(middleware);
app.use(api.routes(), api.allowedMethods());
app.on('ui log', (msg, ctx) => {
 logger(msg);
});
app.on('error', (err, ctx) => {
	logger(err.message, true);
});


app.io.on('connection', client => {
	console.log(`[Socket] new client connected: ${client.id}`);
	client.on('disconnect', () => console.log('[Socket] client disconnected'));
});

const port = process.env.PORT || 8080;
server.listen(port, () =>
	console.log(`[Server] listening on http port ${port}`),
);

connect();
