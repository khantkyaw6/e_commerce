const router = require('express').Router();

const frontendRouteController = require('../../../controllers/v1/admin/frontendRouteController');
const authMiddleware = require('../../../middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/checkPermissionMiddleware');

router
  .route('/')
  .get(
    authMiddleware,
    checkPermission('view-menu-management'),
    frontendRouteController.index,
  )
  .post(
    authMiddleware,
    checkPermission('create-menu-management'),
    frontendRouteController.store,
  );

router
  .route('/:id')
  .get(
    authMiddleware,
    checkPermission('view-menu-management'),
    frontendRouteController.show,
  )
  .put(
    authMiddleware,
    checkPermission('update-menu-management'),
    frontendRouteController.update,
  )
  .delete(
    authMiddleware,
    checkPermission('delete-menu-management'),
    frontendRouteController.destory,
  );

module.exports = router;
