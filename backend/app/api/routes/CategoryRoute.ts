import CategoryController from '../controllers/CategoryController';

export default function (app, verifyToken) {
  // todoList Routes
  app.route('/categories')
    .get(CategoryController.listAllCategories)
    .post(verifyToken, CategoryController.createCategory);


  app.route('/categories/:id')
    .get(CategoryController.readCategory)
    .put(verifyToken, CategoryController.updateCategory)
    .delete(verifyToken, CategoryController.deleteCategory);
}
