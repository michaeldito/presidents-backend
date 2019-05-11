const server = require('../server');
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('socket up and running')
  console.log(socket.id);

  socket.on('SEND_MESSAGE', function(data){
    io.emit('RECEIVE_MESSAGE', data);
    console.log(`message received: ${data}`)
  })
});

module.exports = io;