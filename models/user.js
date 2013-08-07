module.exports = function(mongoose) {
  var userSchema = new mongoose.Schema({
    id        : mongoose.Schema.ObjectId      // internal id ?
  , username  : String                            // message content
  , created   : { type: Date, default: Date.now() }   // posted date
  , updated   : Date
  , chatroom  : { type: String, default: '' }       // chatroom name
  , online    : Boolean
  });

  return mongoose.model('user', userSchema);
}

