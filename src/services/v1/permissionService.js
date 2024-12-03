const { Op } = require('sequelize');

const db = require('../../databases/admin/models');
const Permission = db.Permission;
const { changeGroupName } = require('../../helpers/datatypeHelper');
const AppError = require('../../utils/appError');
const { paginate } = require('../../utils/pagination');

/* eslint-disable no-unused-vars */
const permissionService = {
  index: async (req) => {
    try {
      const { page, limit, search } = req.query;

      let queryOptions = {
        attributes: ['id', 'name', 'group'],
        raw: true,
      };

      if (search) {
        const modifiedSearch = search.replace(/\s+/g, '-');
        queryOptions.where = {
          group: {
            [Op.like]: `%${modifiedSearch}%`,
          },
        };
      }

      const totalGroupCount = await Permission.count({
        distinct: true,
        col: 'group',
        where: queryOptions.where,
      });

      if (page && limit) {
        queryOptions = paginate(queryOptions, { page, limit });
      }

      const { count, rows: permissions } =
        await Permission.findAndCountAll(queryOptions);

      const groupedData = {};

      permissions.forEach((item) => {
        const groupName = changeGroupName(item.group);

        if (!(groupName in groupedData)) {
          groupedData[groupName] = {
            group: groupName,
            data: [],
          };
        }

        groupedData[groupName].data.push({
          ...item,
          group: item.group, // Keep the original group name
        });
      });

      // Define the custom order for permissions
      const customOrder = ['view', 'create', 'update', 'delete'];

      // Sort permissions within each group
      for (const groupKey in groupedData) {
        if (groupKey in groupedData) {
          groupedData[groupKey].data.sort((a, b) => {
            const orderA = customOrder.indexOf(a.name.split('-')[0]);
            const orderB = customOrder.indexOf(b.name.split('-')[0]);
            return orderA - orderB;
          });
        }
      }
      const data = Object.values(groupedData);

      const totalPages = Math.ceil(count / limit);

      return {
        status: 200,
        message: req.t('permission_lists_success'),
        data,
        totalGroupCount: totalGroupCount,
        count,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  store: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const { group } = req.body;

      const groupToLowerCase = group.toLowerCase().replace(/ /g, '-');

      const exitPermission = await Permission.findOne({
        where: { group: groupToLowerCase },
      });

      if (exitPermission)
        throw new AppError('Permission Name is already exit!', 400);

      const permissionNames = [
        `create-${groupToLowerCase}`,
        `view-${groupToLowerCase}`,
        `update-${groupToLowerCase}`,
        `delete-${groupToLowerCase}`,
      ];

      const result = await Permission.bulkCreate(
        permissionNames.map((name) => ({
          name,
          group: groupToLowerCase,
        })),
        { transaction: t },
      );
      await t.commit();
      return {
        status: 200,
        message: req.t('permission_create_success'),
        data: result,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  show: async (req) => {
    try {
      const permission = await Permission.findByPk(req.params.id, {
        attributes: ['id', 'name', 'group'],
      });

      if (!permission) {
        throw new Error(req.t('permission_id_not_found'));
      }

      return {
        status: 200,
        message: req.t('permission_view_sucess'),
        data: permission,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  delete: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const checkPermit = await Permission.findByPk(req.params.id);
      if (!checkPermit) {
        throw new Error(req.t('permission_id_not_found'));
      }
      //delete pivot table Role_Has_Permission
      // await checkPermit.setRoles([]);
      // await checkPermit.destroy();
      //end
      /// Find roles associated with the permission
      const roles = await checkPermit.getRoles();

      // Remove the permission from the pivot table for each associated role
      for (const role of roles) {
        await role.removePermission(checkPermit, { transaction: t });
      }

      // Now, delete the permission itself
      await Permission.destroy({
        where: { id: req.params.id },
        transaction: t,
      });

      // Remove the permission from the pivot table for each associated role
      // for (const rolePermission of rolePermissions) {
      //   await checkPermit.removeRole(rolePermission, { transaction: t });
      // }

      // Now, delete the permission itself
      // await checkPermit.destroy({ transaction: t });

      await t.commit();
      return {
        status: 200,
        message: req.t('permission_delete_success'),
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },
};

module.exports = permissionService;
