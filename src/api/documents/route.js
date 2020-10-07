const express = require('express');
const { upload, download, getFileList } = require('./controller');
const { verifyToken } = require('../auth/controller');

const router = express.Router();

router.post('/upload', verifyToken, upload);
router.get('/getFileList', verifyToken, getFileList);
router.get('/download/:filename', verifyToken, download);

module.exports = router;
