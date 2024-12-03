const router = require('express').Router();

const adminRoute = require('./adminRoute');
const authRoute = require('./authRoute');
const frontendRoute = require('./frontendrouteRoute');
const permissionRoute = require('./permissionRoute');
const roleRoute = require('./roleRoute');

router.use('/permissions', permissionRoute);
router.use('/roles', roleRoute);
router.use('/users', adminRoute);
router.use('/auth', authRoute);
router.use('/routes', frontendRoute);

module.exports = router;
