const router = require('express').Router();

const subcategoryController = require('../../../controllers/v1/admin/subcategoryController');
const authMiddleware = require('../../../middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/checkPermissionMiddleware');
const uploadFileMiddleware = require('../../../middlewares/uploadFileMiddleware');

router
  .route('/')
  .get(subcategoryController.index)
  .post(
    authMiddleware,
    checkPermission('create-subcategory'),
    uploadFileMiddleware.upload.single('subcategory_image'),
    subcategoryController.store,
  );

router
  .route('/:id')
  .get(subcategoryController.show)
  .put(
    authMiddleware,
    checkPermission('create-subcategory'),
    uploadFileMiddleware.upload.single('subcategory_image'),
    subcategoryController.update,
  )
  .delete(
    authMiddleware,
    checkPermission('create-subcategory'),
    uploadFileMiddleware.upload.single('subcategory_image'),
    subcategoryController.destory,
  );

module.exports = router;
