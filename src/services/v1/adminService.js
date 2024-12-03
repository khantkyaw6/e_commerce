/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');

const db = require('../../databases/admin/models');
const Admin = db.Admin;
const Role = db.Role;
const Route = db.Route;
const AdminRole = db.Admin_Has_Role;
const AdminRoute = db.Admin_Has_Route;

const adminService = {
  index: async (req) => {
    try {
      const admins = await Admin.findAll({
        attributes: ['id', 'name', 'email', 'phone'],
        include: [
          {
            model: Role,
            as: 'roles',
            through: {
              model: AdminRole,
              attributes: [],
            },
            attributes: ['id', 'name'],
          },
        ],
      });

      return {
        status: 200,
        message: req.t('admin_lists_success'),
        data: admins,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  store: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const { name, email, password, phone, roles, routes } = req.body;

      const checkEmail = await Admin.findOne({
        where: { email: email },
      });

      if (checkEmail) {
        throw new Error(req.t('email_already_used'));
      }

      const checkPhone = await Admin.findOne({
        where: { phone: phone },
      });

      if (checkPhone) {
        throw new Error(req.t('phone_already_used'));
      }

      const admin = await Admin.create(
        {
          name,
          email,
          password: bcrypt.hashSync(password, 8),
          phone,
        },
        { transaction: t },
      );

      if (!admin) {
        throw new Error(req.t('admin_create_fail'));
      }

      const adminRoles = roles.map((roleId) => ({
        adminId: admin.id,
        roleId,
      }));

      await AdminRole.bulkCreate(adminRoles, { transaction: t });

      const adminRoutes = routes.map((routeId) => ({
        adminId: admin.id,
        routeId,
      }));

      await AdminRoute.bulkCreate(adminRoutes, { transaction: t });
      await t.commit();

      const result = await Admin.findByPk(admin.id, {
        attributes: ['id', 'name', 'email', 'phone'],
        include: [
          {
            model: Role,
            as: 'roles',
            attributes: ['id', 'name'],
            through: {
              attributes: [],
            },
          },
          {
            model: Route,
            as: 'routes',
            attributes: ['id', 'label', 'path', 'key', 'icon', 'parent_id'],
            through: {
              attributes: [],
            },
          },
        ],
      });

      return {
        status: 200,
        message: req.t('admin_create_success'),
        data: result,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  show: async (req) => {
    try {
      const admin = await Admin.findByPk(req.params.id, {
        attributes: ['id', 'name', 'email', 'phone'],
        include: [
          {
            model: Role,
            as: 'roles',
            through: {
              model: AdminRole,
              attributes: [],
            },
            attributes: ['id', 'name'],
          },
          {
            model: Route,
            as: 'routes',
            through: {
              attributes: [],
            },
            attributes: ['id', 'label', 'path', 'key', 'icon', 'parent_id'],
          },
        ],
        // raw: true
      });

      if (!admin) {
        throw new Error(req.t('admin_id_not_found'));
      }

      const topLevelRoutes = [];
      const routeMap = new Map();

      admin.routes.forEach((route) => {
        const { id, label, path, key, icon, parent_id } = route;
        const routeData = {
          id,
          label,
          path,
          key,
          icon,
          parent_id,
          children: [],
        };

        routeMap.set(id, routeData);

        if (parent_id === null) {
          topLevelRoutes.push(routeData);
        }
      });

      admin.routes.forEach((route) => {
        const { id, parent_id } = route;
        if (parent_id !== null && routeMap.has(parent_id)) {
          routeMap.get(parent_id).children.push(routeMap.get(id));
        }
      });

      const modifiedResult = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        roles: admin.roles,
        routes: topLevelRoutes,
      };

      return {
        status: 200,
        message: req.t('admin_view_sucess'),
        data: modifiedResult,
      };
    } catch (error) {
      throw new Error(Error);
    }
  },

  update: async (req) => {
    const adminId = req.params.id;
    const t = await db.sequelize.transaction();
    try {
      const { name, email, password, phone, roles, routes } = req.body;

      const admin = await Admin.findByPk(adminId);
      if (!admin) {
        throw new Error(req.t('admin_id_not_found'));
      }

      if (email !== admin.email) {
        const existingEmail = await Admin.findOne({ where: { email } });
        if (existingEmail) {
          throw new Error(req.t('email_already_used'));
        }
      }

      if (phone !== admin.phone) {
        const existingPhone = await Admin.findOne({ where: { phone } });
        if (existingPhone) {
          throw new Error(req.t('phone_already_used'));
        }
      }

      await Admin.update(
        {
          name,
          email,
          password: password ? bcrypt.hashSync(password, 8) : admin.password,
          phone,
        },
        { where: { id: adminId } },
        { transaction: t },
      );

      const findAdminRole = await AdminRole.findAll({ where: { adminId } });
      if (findAdminRole) {
        await AdminRole.destroy({ where: { adminId } }, { transaction: t });
      }

      const findAdminRoute = await AdminRoute.findAll({ where: { adminId } });
      if (findAdminRoute) {
        await AdminRoute.destroy({ where: { adminId } }, { transaction: t });
      }

      const adminRoles = roles.map((roleId) => ({
        adminId: adminId,
        roleId,
      }));

      await AdminRole.bulkCreate(adminRoles, { transaction: t });

      const adminRoutes = routes.map((routeId) => ({
        adminId: admin.id,
        routeId,
      }));

      await AdminRoute.bulkCreate(adminRoutes, { transaction: t });
      await t.commit();

      const result = await Admin.findByPk(adminId, {
        attributes: ['id', 'name', 'email', 'phone'],
        include: {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name'],
          through: {
            attributes: [],
          },
        },
      });

      return {
        status: 200,
        message: req.t('admin_update_success'),
        data: result,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  delete: async (req) => {
    const adminId = req.params.id;
    const t = await db.sequelize.transaction();
    try {
      const admin = await Admin.findByPk(adminId);
      if (!admin) {
        throw new Error('admin_id_not_found');
      }

      await AdminRole.destroy({ where: { adminId } }, { transaction: t });
      await AdminRoute.destroy({ where: { adminId } }, { transaction: t });
      await admin.destroy({ transaction: t });
      await t.commit();
      return {
        status: 200,
        message: req.t('admin_delete_success'),
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },
};

module.exports = adminService;
