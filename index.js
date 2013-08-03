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

  // listen to user join event
  socket.on('user_join', function(name) {
    socket.nickname = name;

    // emit old message to this user
    Chat.find({}, 'message author date').exec(function(err, chats) {
      for (var i in chats) {
        socket.emit('message_out', chats[i]);
      }
    });

    // emit join message to all users except this user
    socket.broadcast.emit('message_out', {
      message: ' I joined the chat.'
    , author: socket.nickname
    , date: Date.now
    });

  });

  // listen to message in event
  socket.on('message_in', function(msg) {
    // time = (new Date()).toFormat('HH24:MI:SS');

    // assign a datestamp to the incoming message
    msg.date = Date.now;
    // store the message to database
    new Chat(msg).save(function(err) {});
    // broadcast the message to all users
    io.sockets.emit('message_out', msg);
    // socket.broadcast.emit('text', socket.nickname, msg);
  })

  // listen to message out event, never


});

