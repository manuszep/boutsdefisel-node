import ServiceController from '../controllers/ServiceController';
import getUploader from '../../lib/storage';

const uploader = getUploader("services");

export default function (app, verifyToken) {
  app.route('/services')
    .get(ServiceController.listAllServices)
    .post([verifyToken, uploader.single('picture')], ServiceController.createService);


  app.route('/services/:slug')
    .get(ServiceController.readService)
    .put([verifyToken, uploader.single('picture')], ServiceController.updateService)
    .delete(verifyToken, ServiceController.deleteService);
}
