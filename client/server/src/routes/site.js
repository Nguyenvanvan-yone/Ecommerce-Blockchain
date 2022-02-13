const express = require('express');
const router = express.Router();
const siteController = require('../app/Controllers/SiteController');

router.use('/search',siteController.search);
router.use('/news',siteController.store)
router.use('/',siteController.index);

module.exports = router;
