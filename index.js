var express = require('express')
, sio = require('socket.io');

require('date-utils');

var app = express()
, server = require('http').createServer(app);

app.use(express.static('public'));
server.listen(3000);

var io = sio.listen(server);
io.sockets.on('connection', function(socket) {
  // console.log('someone connected');
  socket.on('join', function(name) {
    socket.nickname = name;
    // emit to that client
    // socket.emit('news', name + ' joined the chat.');
    // emit to all clients
    // io.sockets.emit('news', name + ' joined the chat.');
    // emit to all except this client
    socket.broadcast.emit('news', name + ' joined the chat.');
  });
  socket.on('text', function(msg) {
    // io.sockets.emit('news', msg);
    time = (new Date()).toFormat('HH24:MI:SS');
    socket.broadcast.emit('text', socket.nickname, '(' + time + ') ' + msg);
  })
});

