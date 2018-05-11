import UserManager from "../models/UserManager";

export default {
  list_all_users: function(req, res) {
    UserManager.findAll().then(rows => {
      res.json(rows);
    })
    .catch(err => {
      res.status(500).json(err);
    });
  },
  create_a_user: async function(req, res, next) {
    const user = UserManager.getModel(req.body);

    user.persist()
      .then(id => {
        res.json(user.serialize());
      })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  read_a_user: function(req, res) {
    UserManager.findOne(req.params.id).then(row => {
      res.json(row);
    })
    .catch(err => {
      res.status(500).json(err);
    });
  },
  update_a_user: function(req, res) {
    UserManager.findOne(req.params.id)
    .then(user => {
      user.unserialize(req.body);
      return user.persist();
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
  },
  delete_a_user: function(req, res) {
    UserManager.findOne(req.params.id)
    .then(user => {
      return user.delete();
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
  }
};
