import UserModel from "../models/UserModel";

export default {
  list_all_users: function(req, res) {
    res.json([{username: "user1"}, {username: "user2"}, {username: "user3"}]);
  },
  create_a_user: async function(req, res, next) {
    const user = new UserModel();
    user.username = req.body.username;
    user.email = req.body.email;

    user.persist()
      .then(id => {
        res.json(user.serialize());
      })
      .catch(err => {
        console.log(JSON.stringify({code: err.code, msg: err.sqlMessage}));
        res.status(500).json({code: err.code, msg: err.sqlMessage});
      });
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
