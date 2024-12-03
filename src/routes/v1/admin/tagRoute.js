const router = require('express').Router();

const tagController = require('../../../controllers/v1/admin/tagController');
const authMiddleware = require('../../../middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/checkPermissionMiddleware');

router
  .route('/')
  .get(tagController.index)
  .post(authMiddleware, checkPermission('create-tag'), tagController.store);

router
  .route('/:id')
  .put(authMiddleware, checkPermission('update-tag'), tagController.update)
  .delete(authMiddleware, checkPermission('delete-tag'), tagController.destory);

module.exports = router;
