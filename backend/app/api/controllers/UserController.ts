import UserManager from '../models/UserManager';

export default {
  listAllUsers: (req, res) => {
    UserManager.findAll().then(rows => {
      res.json(rows);
    })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  createUser: (req, res) => {
    const user = UserManager.getModel(req.body);
    user.persist()
      .then(() => {
        res.json(user.serialize());
      })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  readUser: (req, res) => {
    UserManager.findOne(req.params.id).then(user => {
      res.json(user.serialize());
    })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  updateUser: (req, res) => {
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
  deleteUser: (req, res) => {
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
