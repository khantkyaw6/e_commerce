const router = require('express').Router();

const authController = require('../../../controllers/v1/admin/authController');
const authMiddleware = require('../../../middlewares/authMiddleware');

router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
