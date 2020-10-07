const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const appSecret = config.app_secret;
const tokenExpiryTime = config.token_expiry_time;

exports.generateToken = (user, options) => {
  const token = jwt.sign(
    {
      userId: user.userId.toString(),
      role: user.userRole,
    },
    appSecret,
    {
      expiresIn: parseInt(tokenExpiryTime),
    }
  );
  return token;
};

exports.verifyToken = async (req, res, next) => {
  let decoded = false;
  try {
    decoded = await jwt.verify(req.headers['authorization'], appSecret);
  } catch (error) {
    return res
      .status(401)
      .send({ message: 'Session expired. Please login again.' });
  }
  if (decoded.userId) {
    req.userId = decoded.userId;
    req.role = decoded.role;
    return next();
  } else {
    return res.status(400).send({ message: 'Invalid Access Token' });
  }
};
