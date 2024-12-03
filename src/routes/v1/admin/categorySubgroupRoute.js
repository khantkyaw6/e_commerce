const router = require('express').Router();

const categorySubgroupController = require('../../../controllers/v1/admin/categorySubgroupController');
const authMiddleware = require('../../../middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/checkPermissionMiddleware');
const uploadFileMiddleware = require('../../../middlewares/uploadFileMiddleware');

router
  .route('/')
  .get(categorySubgroupController.index)
  .post(
    authMiddleware,
    checkPermission('create-categorysubgroup'),
    uploadFileMiddleware.upload.single('subgroup_image'),
    categorySubgroupController.store,
  );

router
  .route('/:id')
  .get(categorySubgroupController.show)
  .put(
    authMiddleware,
    checkPermission('update-categorysubgroup'),
    uploadFileMiddleware.upload.single('subgroup_image'),
    categorySubgroupController.update,
  )
  .delete(
    authMiddleware,
    checkPermission('delete-categorysubgroup'),
    categorySubgroupController.destory,
  );

module.exports = router;
