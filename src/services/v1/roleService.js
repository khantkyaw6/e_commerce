const db = require('../../databases/admin/models');
const Role = db.Role;
const Permission = db.Permission;
const RolePermission = db.Role_Has_Permission;
const AdminRole = db.Admin_Has_Role;
// const { changeGroupName } = require('../../helpers/datatypeHelper');

const roleService = {
  index: async (req) => {
    try {
      const roles = await Role.findAll({
        attributes: ['id', 'name', 'createdAt'],
      });

      const filteredRoles = roles.filter((role) => role.id !== 1);

      return {
        status: 200,
        message: req.t('role_lists_success'),
        data: filteredRoles,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  store: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const { name, permissions } = req.body;

      const checkRole = await Role.findOne({ where: { name: name } });
      if (checkRole) {
        throw new Error(req.t('role_name_already_used'));
      }

      const role = await Role.create({ name }, { transaction: t });

      if (!role) {
        throw new Error(req.t('role_create_fail'));
      }

      const rolePermissions = permissions.map((permissionId) => ({
        roleId: role.id,
        permissionId,
      }));

      await RolePermission.bulkCreate(rolePermissions, { transaction: t });
      await t.commit();

      const result = await Role.findByPk(role.id, {
        attributes: ['id', 'name'],
        include: {
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'name', 'group'],
          through: {
            attributes: [],
          },
        },
      });

      return {
        status: 200,
        message: req.t('role_create_success'),
        data: result,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  show: async (req) => {
    try {
      const role = await Role.findByPk(req.params.id, {
        attributes: ['id', 'name'],
        include: {
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'name', 'group'],
          through: {
            attributes: [],
          },
        },
      });

      if (!role) {
        throw new Error(req.t('role_id_not_found'));
      }

      // let permissions;
      // permissions = await Permission.findAll({
      //   attributes: ['id', 'name', 'group'],
      //   raw: true,
      // });

      // // Convert the permissions in roles to an object for easier filtering
      // const rolePermissions = role.permissions.reduce((result, permission) => {
      //   result[permission.id] = permission;
      //   return result;
      // }, {});

      // // Iterate through all permissions and add isChecked based on their presence in the role's permissions
      // const permissionsWithChecked = permissions.map((permission) => ({
      //   ...permission,
      //   isChecked: !!rolePermissions[permission.id],
      // }));

      // const groupedData = {};
      // permissionsWithChecked.forEach((item) => {
      //   // const groupName = item.group;
      //   const groupName = changeGroupName(item.group);
      //   if (!(groupName in groupedData)) {
      //     groupedData[groupName] = {
      //       group: groupName,
      //       data: [],
      //     };
      //   }
      //   groupedData[groupName].data.push({
      //     ...item,
      //     group: item.group, // Keep the original group name
      //   });
      // });

      // const customOrder = ['view', 'create', 'update', 'delete'];

      // // Sort permissions within each group
      // for (const groupKey in groupedData) {
      //   if (groupKey in groupedData) {
      //     groupedData[groupKey].data.sort((a, b) => {
      //       const orderA = customOrder.indexOf(a.name.split('-')[0]);
      //       const orderB = customOrder.indexOf(b.name.split('-')[0]);
      //       return orderA - orderB;
      //     });
      //   }
      // }
      // permissions = Object.values(groupedData);

      // const roleData = await Role.findByPk(req.params.id, {
      //   attributes: ['id', 'name'],
      // });

      const permissions = role.permissions.map((permission) => permission.id);

      const responseData = {
        id: role.id,
        name: role.name,
        permissions,
      };

      return {
        status: 200,
        message: req.t('role_view_sucess'),
        data: responseData,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  update: async (req) => {
    const roleId = req.params.id;
    const t = await db.sequelize.transaction();
    try {
      const { name, permissions } = req.body;

      const role = await Role.findByPk(roleId);

      if (!role) {
        throw new Error(req.t('role_id_not_found'));
      }

      if (role.id === 1) {
        return new Error(`Can't Update Super Admin Role`);
      }

      if (name !== role.name) {
        // Check if the updated name is different from the existing role's name
        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) {
          throw new Error(req.t('role_name_already_used'));
        }
      }

      await role.update(
        {
          name,
        },
        { transaction: t },
      );

      await RolePermission.destroy({ where: { roleId } });

      const rolePermissions = permissions.map((permissionId) => ({
        roleId,
        permissionId,
      }));

      await RolePermission.bulkCreate(rolePermissions, { transaction: t });
      await t.commit();

      const result = await Role.findByPk(role.id, {
        attributes: ['id', 'name'],
        include: {
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'name', 'group'],
          through: {
            attributes: [],
          },
        },
      });

      return {
        status: 200,
        message: req.t('role_update_success'),
        data: result,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  delete: async (req) => {
    const roleId = req.params.id;
    const t = await db.sequelize.transaction();
    try {
      const role = await Role.findByPk(roleId);
      if (!role) {
        return new Error(req.t('role_id_not_found'));
      }

      if (role.id === 1) {
        return new Error(`Can't Delete Super Admin Role`);
      }

      // Delete associated admin roles from the admin_role pivot table
      await AdminRole.destroy({ where: { roleId } }, { transaction: t });

      // Delete associated permission from the roel_permission pivot table
      await RolePermission.destroy({ where: { roleId } }, { transaction: t });

      await role.destroy({ transaction: t });
      await t.commit();

      return {
        status: 200,
        message: req.t('role_delete_success'),
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },
};

module.exports = roleService;
