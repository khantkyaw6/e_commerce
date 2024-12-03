const db = require('../databases/admin/models');
const AppError = require('../utils/appError');

module.exports = async (req, res, next) => {
  const item = {
    authUserId: req.authUserId,
    authPermissionKey: req.authUserPermissionKey || null,
  };
  const admin = await db.Admin.findOne(
    {
      where: {
        id: item.authUserId,
      },
      include: {
        model: db.Role,
        as: 'roles',
        include: {
          model: db.Permission,
          as: 'permissions',
          where: { key: item.authPermissionKey },
        },
      },
    },
    { raw: true },
  );
  if (admin?.roles[0]?.permissions === undefined)
    return next(new AppError('User not Permission', 401));
  next();
};
