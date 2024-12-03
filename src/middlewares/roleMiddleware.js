const db = require('../databases/admin/models');
const AppError = require('../utils/appError');

exports.roleMiddleware = (role_name) => {
  return async (req, res, next) => {
    const id = req.authUserId;
    const admin = await db.Admin.findOne(
      {
        where: {
          id,
        },
        include: {
          model: db.Role,
          as: 'roles',
        },
      },
      { raw: true },
    );
    if (!admin || admin.roles[0].name !== role_name)
      return next(new AppError('Your not in this role!', 403));
    admin.roles[0].name === role_name && next();
  };
};
