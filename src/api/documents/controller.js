const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const config = require('../../config/config');
const { saveHistory } = require('../histories/controller');
const userModel = require('../users/model');

const algorithm = config.crypto_algorithm;
let key = config.crypto_secret_key;
key = crypto.createHash('sha256').update(key).digest('base64').substr(0, 32);

const encrypt = (buffer) => {
  // Create an initialization vector
  const iv = crypto.randomBytes(16);
  // Create a new cipher using the algorithm, key, and iv
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  // Create the new (encrypted) buffer
  const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
  return result;
};

const getIpDetails = async (ip) => {
  try {
    const ipDetails = (
      await axios({
        method: 'get',
        baseURL: `http://www.geoplugin.net/json.gp?ip=${ip}`,
      })
    ).data;
    // const {
    //   geoplugin_request: ipAddress,
    //   geoplugin_city: city,
    //   geoplugin_region: state,
    //   geoplugin_countryName: country,
    //   geoplugin_continentName: continent,
    // } = ipDetails.data;
    if (!ipDetails) return null;
    else return ipDetails;
    // else return { ipAddress, city, state, country, continent };
  } catch (error) {
    console.log(`getIpDetails => ${error}`);
    return error;
  }
};

exports.upload = async (req, res) => {
  try {
    if (req.role !== 'admin') {
      fs.unlink(
        path.resolve(__dirname, `../../../uploads/${file.filename}`),
        () => {
          console.log('Unlinking');
        }
      );
      res.status(200).send({
        status: false,
        success: null,
        error: { message: 'Only admin can upload file!' },
      });
    } else {
      let encrypted;
      const file = req.files[0];
      const source = path.resolve(
        __dirname,
        `../../../uploads/${file.filename}`
      );
      const destination = path.resolve(
        __dirname,
        `../../../encryptedFiles/${file.filename}`
      );
      const myReadable = fs.createReadStream(source);
      const myWritable = fs.createWriteStream(destination);
      myReadable.on('data', (data) => {
        encrypted = encrypt(data);
        if (encrypted) {
          myWritable.write(encrypted);
        }
      });
      myReadable.on('close', () => {
        myWritable.close();
      });
      res.status(200).send({
        status: true,
        success: { message: 'File uploaded successfully', data: [] },
        error: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      success: null,
      error: {
        message: 'Something went wrong!',
      },
    });
  }
};

exports.getFileList = async (req, res) => {
  try {
    const files = [];
    const fileDir = path.resolve(__dirname, `../../../encryptedFiles/`);
    await fs.readdirSync(fileDir).forEach((item) => {
      files.push({ filename: item });
    });
    res.status(200).send({
      status: true,
      success: { message: 'Files fetched successfully', data: files },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      success: null,
      error: {
        message: 'Something went wrong!',
      },
    });
  }
};

exports.download = async (req, res) => {
  try {
    const file = path.resolve(
      __dirname,
      `../../../encryptedFiles/${req.params.filename}`
    );
    const userInfo = await userModel.findOne(
      { _id: req.userId },
      { username: 1, role: 1 }
    );
    const ipDetails = await getIpDetails(req.query.ip);
    const location = {
      type: 'Point',
      coordinates: [
        ipDetails.geoplugin_longitude,
        ipDetails.geoplugin_latitude,
      ],
    };
    await saveHistory({
      userInfo: userInfo,
      ipDetails: ipDetails,
      location: location,
    });
    res.sendFile(file);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      success: null,
      error: {
        message: 'Something went wrong!',
      },
    });
  }
};
