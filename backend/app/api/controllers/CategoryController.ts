import CategoryManager from '../models/CategoryManager';
import { handleError } from '../../lib/error';

export default {
  listAllCategories: (req, res) => {
    CategoryManager.findAll().then(category => {
      res.json(category.serialize());
    })
      .catch(err => {
        handleError(res, err);
      });
  },
  createCategory: (req, res) => {
    const category = CategoryManager.getModel(req.body);
    category.persist()
      .then((result) => {
        res.json(category.serialize());
      })
      .catch(err => {
        console.log(err);
        handleError(res, err);
      });
  },
  readCategory: (req, res) => {
    CategoryManager.findOne(req.params.id).then(category => {
      res.json(category.serialize());
    })
      .catch(err => {
        console.log(err);
        handleError(res, err);
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
        console.log(err);
        handleError(res, err);
      });
  },
  deleteCategory: (req, res) => {
    CategoryManager.findOne(req.params.id)
      .then(category => category.delete())
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        handleError(res, err);
      });
  }
};
