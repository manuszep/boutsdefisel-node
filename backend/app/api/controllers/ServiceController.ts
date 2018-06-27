import fs = require('fs');
import ServiceManager from '../models/ServiceManager';
import UserManager from '../models/UserManager';
import CategoryManager from '../models/CategoryManager';
import { handleError } from '../../lib/error';

export default {
  listAllServices: (req, res) => {
    ServiceManager.findAll().then(rows => {
      res.json(ServiceManager.serializeCollection(rows));
    })
      .catch(err => {
        handleError(res, err);
      });
  },
  createService: (req, res) => {
    let service;
    const data = { ...req.body };

    if (typeof req.file !== "undefined") {
      data.picture = `${req.file.destination}/${req.file.filename}`;
    }

    UserManager.findOne(req.body.user)
      .then(result => {
        data.user = result;
        return CategoryManager.findOne(req.body.category);
      })
      .then(result => {
        data.category = result;
        service = ServiceManager.getModel(data);

        return service.persist();
      })
      .then(() => {
        res.json(service.serialize());
      })
      .catch(err => {
        if (typeof data.picture !== "undefined") {
          fs.unlink(data.picture, (err2) => {
            return;
          });
        }

        handleError(res, err);
      });
  },
  readService: (req, res) => {
    ServiceManager.findOneBySlug(req.params.slug).then(service => {
      res.json(service.serialize());
    })
      .catch(err => {
        handleError(res, err);
      });
  },
  updateService: (req, res) => {
    let service;
    const data = { ...req.body };

    if (typeof req.file !== "undefined") {
      data.picture = `${req.file.destination}/${req.file.filename}`;
    }

    ServiceManager.findOneBySlug(req.params.slug)
      .then(result => {
        service = result;
        return UserManager.findOne(req.body.user || service.user);
      })
      .then(result => {
        data.user = result;
        return CategoryManager.findOne(req.body.category || service.category);
      })
      .then(result => {
        data.category = result;
        service.unserialize(data);
        return service.persist();
      })
      .then(() => {
        res.json(service.serialize());
      })
      .catch(err => {
        if (typeof data.picture !== "undefined") {
          fs.unlink(data.picture, (err2) => {
            return;
          });
        }
        handleError(res, err);
      });
  },
  deleteService: (req, res) => {
    ServiceManager.findOneBySlug(req.params.slug)
      .then(service => service.delete())
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        handleError(res, err);
      });
  }
};
