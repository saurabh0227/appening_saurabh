const bcrypt = require('bcryptjs');
const model = require('./model');
const auth = require('../auth/controller');

exports.signup = async (req, res) => {
  try {
    const body = req.body;
    const password = await bcrypt.hashSync(body.password, 5);
    body.password = password;
    const userData = new model(body);
    const insertedUser = await userData.save();
    const user = await model.findOne(
      { _id: insertedUser._id },
      { password: 0 }
    );
    res.status(200).send({
      status: true,
      success: {
        message: 'Registered successfully!',
        data: [user],
      },
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

exports.login = async (req, res) => {
  try {
    const body = req.body;
    const userData = await model.findOne(
      { username: body.username },
      { password: 0 }
    );
    if (!userData) {
      res.status(700).send({
        status: false,
        success: null,
        error: {
          message: 'Please register first!',
        },
      });
    } else {
      const password = (
        await model.findOne({ username: body.username }, { password: 1 })
      ).password;
      const passwordsMatch = await bcrypt.compareSync(body.password, password);
      if (passwordsMatch) {
        const token = {
          token: await auth.generateToken(
            { userId: userData._id, userRole: userData.role },
            {}
          ),
        };
        res.status(200).send({
          status: true,
          success: {
            message: 'Login successfully!',
            data: [token],
          },
          error: null,
        });
      } else {
        res.status(500).send({
          status: false,
          success: null,
          error: {
            message: 'Password mismatched!',
          },
        });
      }
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
