const db = require('../databases/admin/models'); // Import your Sequelize models

const checkPermission = (permission) => {
  return async (req, res, next) => {
    const userId = req.authUserId; // Assuming user information is stored in req.authUserId

    try {
      if (userId === 1) {
        // If user ID is 1, allow them to pass without checking for any permission
        return next();
      }

      const user = await db.Admin.findByPk(userId, {
        include: [
          {
            model: db.Role,
            as: 'roles',
            include: { model: db.Permission, as: 'permissions' },
          },
        ],
      });

      if (user) {
        for (const role of user.roles) {
          //return responseMessage(res, 'hello', role.permissions);
          if (role.permissions.some((p) => p.name === permission)) {
            // User has the required permission
            return next();
          } else {
            res.status(403).json({ message: 'No Permission' });
          }
        }
      } else {
        // User not found
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = checkPermission;
