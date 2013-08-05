exports.index = function(config) {

  return function(req, res) {
    var chatroom = '';
    if (req.params.chatroom) chatroom = req.params.chatroom;
    res.render('index', {
      config: config
    , chatroom: chatroom
    });
  }

};
