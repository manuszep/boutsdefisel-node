import ServiceController from '../controllers/ServiceController';

export default function (app, verifyToken) {
  // todoList Routes
  app.route('/services')
    .get(ServiceController.listAllServices)
    .post(verifyToken, ServiceController.createService);


  app.route('/services/:slug')
    .get(ServiceController.readService)
    .put(verifyToken, ServiceController.updateService)
    .delete(verifyToken, ServiceController.deleteService);
}
