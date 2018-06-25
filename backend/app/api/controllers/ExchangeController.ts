import ExchangeManager from '../models/ExchangeManager';
import UserManager from '../models/UserManager';
import { handleError } from '../../lib/error';

export default {
  listAllExchanges: (req, res) => {
    ExchangeManager.findAll().then(rows => {
      res.json(ExchangeManager.serializeCollection(rows));
    })
      .catch(err => {
        handleError(res, err);
      });
  },
  createExchange: (req, res) => {
    const data = { ...req.body };
    let exchange;

    UserManager.findOne(req.body.creditUser)
      .then(result => {
        data.creditUser = result;
        return UserManager.findOne(req.body.debitUser);
      })
      .then(result => {
        data.debitUser = result;
        exchange = ExchangeManager.getModel(data);

        return exchange.persist();
      })
      .then(() => {
        res.json(exchange.serialize());
      })
      .catch(err => {
        handleError(res, err);
      });
  },
  readExchange: (req, res) => {
    ExchangeManager.findOne(req.params.id).then(exchange => {
      res.json(exchange.serialize());
    })
      .catch(err => {
        handleError(res, err);
      });
  },
  updateExchange: (req, res) => {
    const data = { ...req.body };
    let exchange;

    ExchangeManager.findOne(req.params.id)
      .then(result => {
        exchange = result;
        return UserManager.findOne(req.body.creditUser || exchange.creditUser);
      })
      .then(result => {
        data.creditUser = result;
        return UserManager.findOne(req.body.debitUser || exchange.debitUser);
      })
      .then(result => {
        data.debitUser = result;
        exchange.unserialize(data);
        return exchange.persist();
      })
      .then(() => {
        res.json(exchange.serialize());
      })
      .catch(err => {
        handleError(res, err);
      });
  },
  deleteExchange: (req, res) => {
    const data = { ...req.body };
    let exchange;
    ExchangeManager.findOne(req.params.id)
      .then(result => {
        exchange = result;
        return UserManager.findOne(exchange.creditUser);
      })
      .then(result => {
        data.creditUser = result;
        return UserManager.findOne(exchange.debitUser);
      })
      .then(result => {
        data.debitUser = result;
        exchange.unserialize(data);
        return exchange.delete();
      })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        handleError(res, err);
      });
  }
};
