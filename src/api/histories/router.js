const express = require('express');
const { getHistories } = require('./controller');
const { verifyToken } = require('../auth/controller');

const router = express.Router();

router.get('/getHistories', verifyToken, getHistories);

module.exports = router;
