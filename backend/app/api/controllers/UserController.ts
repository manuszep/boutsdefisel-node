export default {
  list_all_users: function(req, res) {
    res.json([{username: "user1"}, {username: "user2"}, {username: "user3"}]);
  },
  create_a_user: function(req, res) {
    res.json({"body": req.body});
  },
  read_a_user: function(req, res) {
    res.json({username: "user1"});
  },
  update_a_user: function(req, res) {
    res.json({username: "user2"});
  },
  delete_a_user: function(req, res) {
    res.json({ message: 'User successfully deleted' });
  }
};
