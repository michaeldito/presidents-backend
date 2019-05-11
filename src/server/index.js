const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const http = require('http');
const logger = require('koa-logger');
const cors = require('kcors');
const router = require('../routes');
const jwtErrorMiddleware = require('../middleware/jwtError');

require('dotenv').config();

const app = new Koa();

app.use(bodyParser());
app.use(logger());
app.use(cors({ credentials: true, exposeHeaders: ['Access-Token', 'Cookie'] }));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';  

// Custom error catch for koa-jwt so that we can log the specific error message
// when attempting to read and parse the access_token
app.use(async (ctx, next) => {
  return next().catch((err) => {
    if(err.status === 401) {
      console.log('[index.js] Sending 401 to the client.');
      ctx.status = 401;
      ctx.body = 'JWT Token expired.';
    } else {
      console.log('[index.js] One of the modules in the chain fired an exception.');
      console.log(`[index.js] The error message is ${err}`);
    }
  });
});

app.use(router.routes(), router.allowedMethods());

const server = http.createServer(app.callback());

const io = require('socket.io')(server);

server.listen(process.env.APP_PORT, () => console.log(`Listening on HTTPS port ${process.env.APP_PORT}`));

io.on('connection', (socket) => {
  console.log('socket up and running')
  console.log(socket.id);

  socket.on('SEND_MESSAGE', function(data){
    io.emit('RECEIVE_MESSAGE', data);
    console.log(`message received: ${data}`)
  })
});

module.exports = app
