const express = require('express');

const users = require('./users/route');
const documents = require('./documents/route');
const histories = require('./histories/router');

const router = express.Router();

router.use('/users', users);
router.use('/documents', documents);
router.use('/histories', histories);

module.exports = router;
