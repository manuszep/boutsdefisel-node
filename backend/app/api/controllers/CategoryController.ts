import CategoryManager from '../models/CategoryManager';

export default {
  listAllCategories: (req, res) => {
    CategoryManager.findAll().then(rows => {
      res.json(CategoryManager.serializeCollection(rows));
    })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  createCategory: (req, res) => {
    const category = CategoryManager.getModel(req.body);
    category.persist()
      .then(() => {
        res.json(category.serialize());
      })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  readCategory: (req, res) => {
    CategoryManager.findOne(req.params.id).then(category => {
      res.json(category.serialize());
    })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  updateCategory: (req, res) => {
    CategoryManager.findOne(req.params.id)
      .then(category => {
        category.unserialize(req.body);
        return category.persist();
      })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  deleteCategory: (req, res) => {
    CategoryManager.findOne(req.params.id)
      .then(category => category.delete())
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
};
