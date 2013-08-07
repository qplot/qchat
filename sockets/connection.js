var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.database);

var Chat = require('../models/chat')(mongoose);
var User = require('../models/user')(mongoose);
var ChatIO;

module.exports = {
  listen : function(io) {
    ChatIO = io;
  },
  connection : function(socket) {
    socket.chatroom = '';
    // console.log('someone connected');

    function broadcast(m, ev) {
      var clients = ChatIO.sockets.clients();
      ev = typeof ev !== 'undefined' ? ev : 'message_out';
      for (var i in clients) {
        if (clients[i].chatroom == m.chatroom)
          clients[i].emit(ev, m);
      }
    };

    // listen to user join event
    // socket.on('user_join', function(join) {
    //   socket.nickname = join.username;
    //   socket.chatroom = join.chatroom;

    //   // add user if not found
    //   User.findOneAndUpdate({username: socket.nickname, chatroom: socket.chatroom, online: true}, {updated: Date.now()}, {upsert: true}, function(err, user) {});

    //   // emit old message to this user
    //   Chat.find({chatroom: socket.chatroom}, 'message author date', function(err, chats) {
    //     for (var i in chats) {
    //       socket.emit('message_out', chats[i]);
    //     }
    //   });

    //   // emit join message to all users except this user
    //   // socket.broadcast.emit('message_out', {
    //   // io.of('/' + socket.chatroom).emit('message_out', {
    //   broadcast({
    //     message: 'I joined the chat.'
    //   , author: socket.nickname
    //   , date: Date.now
    //   , chatroom: socket.chatroom
    //   });
    // });

    socket.on('disconnect', function() {
      User.findOneAndUpdate({username: socket.nickname, chatroom: socket.chatroom, online: false}, {updated: Date.now()}, {upsert: true}, function(err, user) {});
      broadcast({
        message: 'I left the chat.'
      , author: socket.nickname
      , date: Date.now()
      , chatroom: socket.chatroom
      , action: 'leave'
      });
    });

    // listen to message in event
    socket.on('message_in', function(msg) {
      // time = (new Date()).toFormat('HH24:MI:SS');

      // assign a datestamp to the incoming message
      // var time = Date.now();
      msg.date = Date.now();
      msg.chatroom = socket.chatroom;

      // console.log(msg);
      // store the message to database
      new Chat(msg).save(function(err) {});
      // broadcast the message to all users
      // io.of('/' + socket.chatroom).emi('message_out', msg);

      // act on the message
      if (msg.action == 'join') {
        socket.nickname = msg.author;
        socket.chatroom = msg.chatroom;

        User.findOneAndUpdate({username: msg.author, chatroom: msg.chatroom, online: true}, {updated: Date.now()}, {upsert: true}, function(err, user) {});

        // emit old message to this user
        Chat.find({chatroom: msg.chatroom}, 'message author date', function(err, chats) {
          for (var i in chats) {
            socket.emit('message_out', chats[i]);
          }
        });
      }

      // broadcast to the right chatroom
      broadcast(msg);
      // instead of sending to everyone
      // io.sockets.emit('message_out', msg);
      // socket.broadcast.emit('text', socket.nickname, msg);
    });

    // listen to message out event, never
  }
}