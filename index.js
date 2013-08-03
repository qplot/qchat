// require component
var express = require('express')
, mongoose = require('mongoose')
, sio = require('socket.io');

// require('date-utils');

// start express server
var app = express()
, server = require('http').createServer(app);

app.use(express.static('public'));
server.listen(3000);

// start mongodb server
mongoose.connect('mongodb://localhost/qchat');
var Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

var ChatSchema = new Schema({
  id      : ObjectId
, message : String
, author  : String
, date    : { type: Date, default: Date.now }
});
var Chat = mongoose.model('chat', ChatSchema);

// start socket server
var io = sio.listen(server);
io.sockets.on('connection', function(socket) {
  // console.log('someone connected');
  socket.on('join', function(name) {
    socket.nickname = name;
    // emit to that client
    // socket.emit('news', name + ' joined the chat.');
    // emit to all clients
    // io.sockets.emit('news', name + ' joined the chat.');

    // emit old message to the board
    Chat.find({}, 'message author date').exec(function(err, chats) {
      for (var i in chats) {
        socket.emit('text', chats[i].author, chats[i].message);
      }
      // console.log(chats);
    })

    // emit to all except this client
    socket.broadcast.emit('news', name + ' joined the chat.');
  });
  socket.on('text', function(msg) {
    // io.sockets.emit('news', msg);
    // time = (new Date()).toFormat('HH24:MI:SS');

    // store the message
    new Chat({ 
      message: msg
    , author: socket.nickname 
    }).save(function(err) {});
    // broadcast the message
    socket.broadcast.emit('text', socket.nickname, msg);
  })
});

