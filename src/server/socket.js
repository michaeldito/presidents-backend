
const IO = require('koa-socket-2');
const fs = require('fs');
const path = require('path');
const Koa = require('koa');

const io = new IO();
const chat = new IO('chat');
const app = new Koa();

io.attach(app);
chat.attach(app);

// set app middleware
// serve the html
app.use(ctx => {
  ctx.type = 'text/html'
  ctx.body = fs.createReadStream(path.join(__dirname, 'index.html'));
});

// Socket middleware
io.use(async (ctx, next) => {
  ctx.teststring = 'test'
  await next();
});

/**
 * Socket handlers for IO
 */
io.on('connection', ctx => {
  console.log('[koa-socket] - io - connection event', ctx.socket.id);

  io.broadcast('connections', {
    numConnections: io.connections.size
  });
});

io.on('disconnect', ctx => {
  console.log('[koa-socket] - io - leave event', ctx.socket.id);

  io.broadcast('connections', {
    numConnections: io.connections.size
  });
});

io.on('data', (ctx, data) => {
  console.log('[koa-socket] - io - data event', ctx.socket.id);
  console.log('ctx:', ctx.event, ctx.data, ctx.socket.id)
  console.log('ctx.teststring:', ctx.teststring)

  ctx.socket.emit('response', {
    message: 'response from server'
  });
});

io.on('ack', (ctx, data) => {
  console.log('[koa-socket] - io - acknowledgement event', ctx.socket.id);
  ctx.acknowledge('received');
});

io.on('numConnections', packet => {
  console.log(`\nNumber of connections: ${io.connections.size}`);
});

/**
 * Chat handlers
 */
chat.on('connection', ctx => {
  console.log('[koa-socket] - chat - connction event', ctx.socket.id);
});

chat.on('message', ctx => {
  console.log('[koa-socket] - chat - message event', ctx.socket.id);

  // Broadcasts to everybody, including this connection
  app.chat.broadcast('message', 'yo connections, lets chat')

  // Broadcasts to all other connections
  ctx.socket.broadcast.emit('message', 'ok connections:chat:broadcast')

  // Emits to just this socket
  ctx.socket.emit('message', 'ok connections:chat:emit')
})

app.on('error', (err, ctx) => {
 console.log('woah!');
});

app.addListener('logging', (ctx) => {
  console.log('we can log messages like this');
});
// app use routes allowed