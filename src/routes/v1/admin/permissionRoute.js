const router = require('express').Router();

const permissionController = require('../../../controllers/v1/admin/permissionController');
const authMiddleware = require('../../../middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/checkPermissionMiddleware');
const { permissionSchema } = require('../../../schemas/schema');
const { validateBody } = require('../../../utils/validator');
router.use(authMiddleware);
router
  .route('/')
  .get(
    checkPermission('view-permission-management'),
    permissionController.index,
  )
  .post(
    validateBody(permissionSchema.store),
    checkPermission('create-permission-management'),
    permissionController.store,
  );

router
  .route('/:id')
  .get(checkPermission('view-permission-management'), permissionController.show)
  .delete(
    checkPermission('delete-permission-management'),
    permissionController.destory,
  );

module.exports = router;
