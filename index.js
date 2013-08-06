// get app settings
var config = require('./config');

// create express web
var express = require('express')
, routes = require('./routes')

//  setup express app
var app = express()
app.set('view engine', 'ejs');
app.set('view options', {layout: false});
app.use(express.static('public'));
app.get('/:chatroom?', routes.index(config));

// create http server
var server = require('http').createServer(app);
server.listen(config.port);

// create socket server
var sio = require('socket.io');
var io = sio.listen(server);

var qchat  = require('./sockets/connection');
qchat.listen(io);
io.sockets.on('connection', qchat.connection);

// io.sockets.on('connection', function(socket) {
//   socket.chatroom = '';
//   // console.log('someone connected');

//   function broadcastMessage(m) {
//     var clients = io.sockets.clients();
//     for (var i in clients) {
//       if (clients[i].chatroom == socket.chatroom)
//         clients[i].emit('message_out', m);
//     }
//   }

//   // listen to user join event
//   socket.on('user_join', function(join) {
//     socket.nickname = join.username;
//     socket.chatroom = join.chatroom;

//     // emit old message to this user
//     Chat.find({chatroom: socket.chatroom}, 'message author date').exec(function(err, chats) {
//       for (var i in chats) {
//         socket.emit('message_out', chats[i]);
//       }
//     });

//     // emit join message to all users except this user
//     // socket.broadcast.emit('message_out', {
//     // io.of('/' + socket.chatroom).emit('message_out', {
//     broadcastMessage({
//       message: ' I joined the chat.'
//     , author: socket.nickname
//     , date: Date.now
//     , chatroom: socket.chatroom
//     });
//   });

//   // listen to message in event
//   socket.on('message_in', function(msg) {
//     // time = (new Date()).toFormat('HH24:MI:SS');

//     // assign a datestamp to the incoming message
//     // var time = Date.now();
//     msg.date = Date.now();
//     msg.chatroom = socket.chatroom;

//     console.log(msg);
//     // store the message to database
//     new Chat(msg).save(function(err) {
//       console.log('saved');
//     });
//     // broadcast the message to all users
//     // io.of('/' + socket.chatroom).emi('message_out', msg);

//     // broadcast to the right chatroom
//     broadcastMessage(msg);
//     // instead of sending to everyone
//     // io.sockets.emit('message_out', msg);
//     // socket.broadcast.emit('text', socket.nickname, msg);
//   })

//   // listen to message out event, never
// });

