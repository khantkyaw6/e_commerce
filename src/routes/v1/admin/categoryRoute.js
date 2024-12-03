const router = require('express').Router();
const { checkSchema } = require('express-validator');

const categoryController = require('../../../controllers/v1/admin/categoryController');
const authMiddleware = require('../../../middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/checkPermissionMiddleware');
const uploadFileMiddleware = require('../../../middlewares/uploadFileMiddleware');

router
  .route('/')
  .get(categoryController.index)
  .post(
    authMiddleware,
    checkPermission('create-category'),
    uploadFileMiddleware.upload.single('category_icon'),
    categoryController.store,
  );

router
  .route('/:id')
  .get(categoryController.show)
  .put(
    authMiddleware,
    checkPermission('update-category'),
    uploadFileMiddleware.upload.single('category_icon'),
    categoryController.update,
  )
  .delete(
    authMiddleware,
    checkPermission('delete-category'),
    categoryController.destory,
  );

module.exports = router;
