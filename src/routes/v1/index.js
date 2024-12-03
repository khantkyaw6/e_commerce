const router = require('express').Router();

const adminRoute = require('./admin');
const brandRoute = require('./admin/brandRoute');
const categoryRoute = require('./admin/categoryRoute');
const categorySubgroupRoute = require('./admin/categorySubgroupRoute');
const subcategoryRoute = require('./admin/subcategoryRoute');
const tagRoute = require('./admin/tagRoute');

router.use('/admin', adminRoute);

router.use('/categories', categoryRoute);
router.use('/categorysubgroups', categorySubgroupRoute);
router.use('/subcategories', subcategoryRoute);
router.use('/brands', brandRoute);
router.use('/tags', tagRoute);

module.exports = router;
