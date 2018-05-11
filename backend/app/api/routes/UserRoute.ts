import UserController from '../controllers/UserController';

export default function (app, verifyToken) {
  // todoList Routes
  app.route('/users')
    .get(UserController.list_all_users)
    .post(verifyToken, UserController.create_a_user);


  app.route('/users/:id')
    .get(verifyToken, UserController.read_a_user)
    .put(verifyToken, UserController.update_a_user)
    .delete(verifyToken, UserController.delete_a_user);

  app.route('/authenticate')
    .post(UserController.authenticate);
}
