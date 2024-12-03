const router = require('express').Router();

const brandController = require('../../../controllers/v1/admin/brandController');
const authMiddleware = require('../../../middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/checkPermissionMiddleware');
const uploadFileMiddleware = require('../../../middlewares/uploadFileMiddleware');

router
  .route('/')
  .get(brandController.index)
  .post(
    authMiddleware,
    checkPermission('create-brand'),
    uploadFileMiddleware.upload.single('brand_image'),
    brandController.store,
  );

router
  .route('/:id')
  .get(brandController.show)
  .put(
    authMiddleware,
    checkPermission('update-brand'),
    uploadFileMiddleware.upload.single('brand_image'),
    brandController.update,
  )
  .delete(
    authMiddleware,
    checkPermission('delete-brand'),
    brandController.destory,
  );

module.exports = router;
