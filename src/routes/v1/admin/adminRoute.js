const router = require('express').Router();

const adminController = require('../../../controllers/v1/admin/adminController');
const authMiddleware = require('../../../middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/checkPermissionMiddleware');
const { adminSchema } = require('../../../schemas/schema');
const { validateBody } = require('../../../utils/validator');
router.use(authMiddleware);
router
  .route('/')
  .get(
    authMiddleware,
    checkPermission('view-user-registration'),
    adminController.index,
  )
  .post(
    validateBody(adminSchema.store),
    authMiddleware,
    checkPermission('create-user-registration'),
    adminController.store,
  );

router
  .route('/:id')
  .get(
    authMiddleware,
    checkPermission('view-user-registration'),
    adminController.show,
  )
  .put(
    authMiddleware,
    checkPermission('update-user-registration'),
    validateBody(adminSchema.store),
    checkPermission('update-users'),
    adminController.update,
  )
  .delete(
    authMiddleware,
    checkPermission('delete-user-registration'),
    adminController.destory,
  );

module.exports = router;
