const router = require('express').Router();

const roleController = require('../../../controllers/v1/admin/roleController');
const authMiddleware = require('../../../middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/checkPermissionMiddleware');
const { roleSchema } = require('../../../schemas/schema');
const { validateBody } = require('../../../utils/validator');
router.use(authMiddleware);

router
  .route('/')
  .get(checkPermission('view-role'), roleController.index)
  .post(
    validateBody(roleSchema.store),
    checkPermission('create-role'),
    roleController.store,
  );

router
  .route('/:id')
  .get(checkPermission('view-role'), roleController.show)
  .put(
    validateBody(roleSchema.store),
    checkPermission('update-role'),
    roleController.update,
  )
  .delete(checkPermission('delete-role'), roleController.destory);

module.exports = router;
