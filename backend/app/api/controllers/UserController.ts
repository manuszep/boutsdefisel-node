import UserManager from '../models/UserManager';

export default {
  list_all_users: (req, res) => {
    UserManager.findAll().then(rows => {
      res.json(rows);
    })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  create_a_user: (req, res) => {
    const user = UserManager.getModel(req.body);
    user.persist()
      .then(() => {
        res.json(user.serialize());
      })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  read_a_user: (req, res) => {
    UserManager.findOne(req.params.id).then(row => {
      res.json(row);
    })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  update_a_user: (req, res) => {
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
  delete_a_user: (req, res) => {
    UserManager.findOne(req.params.id)
      .then(user => user.delete())
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  authenticate: (req, res) => {
    UserManager.findOneByUsername(req.body.username)
      .then(user => {
        const token = user.authenticate(req.body.password);
        res.json({
          success: true,
          token
        });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
};
