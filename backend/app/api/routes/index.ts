import config from '../../config/security';
import UserRoute from './UserRoute';

import jwt = require('jsonwebtoken');

export const verifyJWTToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (token) {
    return jwt.verify(token, config.secret, (err, decodedToken) => {
      if (err || !decodedToken) {
        return res.status(401).send({
          success: false,
          message: 'Invalid token'
        });
      }

      return next();
    });
  }

  return res.status(401).send({
    success: false,
    message: 'No token'
  });
};

export default app => {
  UserRoute(app, verifyJWTToken);
};
