const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');
const routes = require('./api/index');
// Init mongo
require('./config/mongo');

const app = express();

if (!fs.existsSync(path.resolve(__dirname, '../uploads'))) {
  fs.mkdirSync(path.resolve(__dirname, '../uploads'));
}

if (!fs.existsSync(path.resolve(__dirname, '../encryptedFiles'))) {
  fs.mkdirSync(path.resolve(__dirname, '../encryptedFiles'));
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(multer({ storage: storage }).array('file', 1));
app.use(routes);
app.listen(config.port, () => {
  console.log(`\🚀 Server is listening on ${config.port}`);
});
