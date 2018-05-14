import UserController from '../controllers/UserController';

export default function (app, verifyToken) {
  // todoList Routes
  app.route('/users')
    .get(UserController.listAllUsers)
    .post(verifyToken, UserController.createUser);


  app.route('/users/:id')
    .get(verifyToken, UserController.readUser)
    .put(verifyToken, UserController.updateUser)
    .delete(verifyToken, UserController.deleteUser);

  app.route('/authenticate')
    .post(UserController.authenticate);
}
