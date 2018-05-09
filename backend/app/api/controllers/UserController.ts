import UserManager from "../models/UserManager";

export default {
  list_all_users: function(req, res) {
    UserManager.findAll().then(rows => {
      res.json(rows);
    })
    .catch(err => {
      res.status(500).json({code: err.code, msg: err.sqlMessage});
    });
  },
  create_a_user: async function(req, res, next) {
    const user = UserManager.getModel(req.body);

    user.persist()
      .then(id => {
        res.json(user.serialize());
      })
      .catch(err => {
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
