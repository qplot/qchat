module.exports = function(mongoose) {
  var chatSchema = new mongoose.Schema({
    id      : mongoose.Schema.ObjectId      // internal id ?
  , message : String                              // message content
  , author  : String                              // who wrote this message
  , date    : { type: Date, default: Date.now() }   // posted date
  , chatroom: { type: String, default: '' }       // chatroom name
  });

  return mongoose.model('chat', chatSchema);
} 

