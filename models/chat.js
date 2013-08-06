var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.database);

var chatSchema = new mongoose.Schema({
  id      : mongoose.Schema.ObjectId			// internal id ?
, message : String                            	// message content
, author  : String                            	// who wrote this message
, date    : { type: Date, default: Date.now } 	// posted date
, chatroom: { type: String, default: '' }     	// chatroom name
});

module.exports = mongoose.model('chat', chatSchema);

