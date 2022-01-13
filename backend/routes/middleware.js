
const jwt = require('jsonwebtoken');
const { getUserById } = require('../controller/usersdetails');

//middleware-code
exports.isAuthenticated = async function (req, res, next) {
  try {
    console.log('In middleWare');

    if (req.session && req.session.passport) {
      const { token } = req.session;

      var decoded = jwt.verify(token, 'secret_key');
      const user = await getUserById(decoded.userId);

      if (user) {
        console.log('User found! ');
        next();
      } else {
        console.log('User Not found! ');
        return res.send({
          message: 'You will need to sign-in first.'
        });
      }
    } else {
      console.log('Not logged in ');
      return res.status(401).send({
        message: 'You cannot be authenticated.'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: 'Something went wrong!'
    });
  }
}

