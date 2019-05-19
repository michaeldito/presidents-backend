const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const http = require('http');
const logger = require('koa-logger');
const cors = require('kcors');
const router = require('../routes');
const mongoose = require('mongoose');
const Game = require('../controllers/Game');

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

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
};

mongoose.connect(process.env.MONGODB_URI, options).then(
  () =>  { console.log("[Database] √") },
  err => { console.log("[Database] X ", err) }
);

const server = http.createServer(app.callback());

const io = require('socket.io')(server);

server.listen(process.env.PORT, () => console.log(`[Server] listening on PORT ${process.env.PORT}`));

io.on('connection', async socket => {
  console.log('[Socket] √')

  socket.on('JOIN_GAME', async function(data){
    console.log(`[Socket] JOIN_GAME`);
    console.log(data);
    /* 
      Use the Game.joinGame method to add a user to a game
      If able to join -> emit.toAll(user joined)
      if unable to join -> emit.toCaller(unable to join)
    */
    const ableToJoin = await Game.joinGame(data);
    console.log(ableToJoin)
    if (ableToJoin.status)
      io.emit('UPDATE_GAME', {data: ableToJoin.data});
    else
      io.emit('ERROR', ableToJoin.error);
  })

  socket.on('START_GAME', async function(data){
    /* 
      Use the Game.startGame method to assign cards to players & whoseTurn
      emit('update game)
    */
    const response = { data: {...data, hello: 'world'}};
    io.emit('UPDATE_GAME', response);
  })

  socket.on('PLAY_HAND', async function(data){
    /* 
      Use the Game.playHand method to play a hand for a user
        - Verify the hand is better than the last
          - If so remove it from the players hand
          - Make it the last played hand
      If it is a valid hand, emit.toAll(update)
      If it is not a valid hand, emit.toCaller(invalid)
    */
    
    io.emit('UPDATE_GAME', response);
  })

  socket.on('SKIP', async function(data){
    /* 
      Use the Game.getNextPlayerIdx(currentPlayerIdx)
        - update the game state in mongo
      emit.toAll(newState)
    */
    const response = { data: {...data, hello: 'world'}};
    io.emit('UPDATE_GAME', response);
  })
});

module.exports = app
