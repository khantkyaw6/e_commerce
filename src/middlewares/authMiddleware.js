const jwt = require('jsonwebtoken');

const config = require('../config/auth.config');
const db = require('../databases/admin/models');
const AppError = require('../utils/appError');
const Admin = db.Admin;

module.exports = async (req, res, next) => {
  if (!req.headers['authorization'])
    return next(new AppError('Token not present!', 401));
  const token = req.headers['authorization'].split(' ')[1];

  const secretKey =
    config.token_secret || 'YANGON_YINXIAGE_YULE_DEVELOPMENT_TEAM';

  if (token) {
    jwt.verify(token, secretKey, async (err, authorizedData) => {
      if (err instanceof jwt.TokenExpiredError)
        return next(new AppError(req.t('token_expired'), 401));

      if (err) return next(new AppError(req.t('invalid_token'), 401));

      const exitAdmin = await Admin.findByPk(authorizedData.id);
      if (!exitAdmin) return next(new AppError('Unauthorized Token!', 401));
      // if (!exitAdmin || exitAdmin.authToken !== token)
      //   return next(new AppError('Unauthorized Token!', 401));

      req.authUserId = exitAdmin.id;
      req.authUserPermissionId = req.headers['permission_id'];
      req.token = exitAdmin.authToken;
      next();
    });
  }
};
