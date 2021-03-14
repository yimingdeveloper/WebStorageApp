const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

let verifyToken = (req, res, next) => {
  let token = req.cookies.jwt;
  console.log('token', token);
  console.log(token);
  let isLoginPage = req.originalUrl === '/';
  console.log(isLoginPage);
  if (!token) {
    console.log('token not defined');
    if (isLoginPage) {
      next();
    } else {
      res.redirect('/');
      return res.status(403).send({ message: 'No token provided!' });
    }
  } else {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        if (isLoginPage) {
          next();
        } else {
          res.redirect('/');
        }
      } else {
        console.log('decode id');
        console.log(decoded.id);
        req.userId = decoded.id; // email address
        if (isLoginPage) {
          res.redirect('/files');
        } else {
          next();
        }
      }
    });
  }
};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;
