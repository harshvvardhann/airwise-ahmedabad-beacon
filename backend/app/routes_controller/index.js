const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/', require('./city'));
router.use('/', require('./location'));
router.use('/', require('./measurement'));
router.use('/', require('./prediction'));
router.use('/', require('./notification'));

module.exports = router;
