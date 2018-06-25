import ExchangeController from '../controllers/ExchangeController';

export default function (app, verifyToken) {
  app.route('/exchanges')
    .get(ExchangeController.listAllExchanges)
    .post(verifyToken, ExchangeController.createExchange);


  app.route('/exchanges/:id')
    .get(ExchangeController.readExchange)
    .put(verifyToken, ExchangeController.updateExchange)
    .delete(verifyToken, ExchangeController.deleteExchange);
}
