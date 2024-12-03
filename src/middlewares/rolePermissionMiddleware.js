const db = require('../databases/admin/models');
const AppError = require('../utils/appError');

module.exports = async (req, res, next) => {
  console.log('hello wold');
  const item = {
    authUserId: req.authUserId,
    authRoleId: null,
    authPermissionId: req.authUserPermissionId,
  };
  console.log(item);
  //user ta yout ka multi role phyit naing yin findAll nae shar ya mar...
  const exitAdmin = await db.Admin_Has_Role.findOne({
    where: { adminId: item.authUserId },
    attributes: ['roleId'],
  });
  //user must at least one role...
  if (!exitAdmin) return next(new AppError('User not found', 401));
  //to get role id...
  item.authRoleId = exitAdmin.roleId;

  //find permission and api ka ta kyaung chin lar mar moz...
  // const exitPermissions = await db.Role_Has_Permission.findOne({
  //   where: { roleId: item.authRoleId, permissionId: item.authPermissionId },
  // });
  // if (!exitPermissions) {
  //   const error = new Error('User not Permission');
  //   error.status = 400;
  //   return next(error);
  // }
  next();
};
