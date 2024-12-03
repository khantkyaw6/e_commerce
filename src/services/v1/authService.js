const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const config = require('../../config/auth.config');
const db = require('../../databases/admin/models');
const Admin = db.Admin;
const Route = db.Route;
const Role = db.Role;
const Permission = db.Permission;
const AppError = require('../../utils/appError');

const authService = {
  login: async (req) => {
    try {
      const { email, phone, password } = req.body;

      const searchInput = email ? email : phone;

      const admin = await Admin.findOne(
        {
          where: {
            [Op.or]: [{ email: searchInput }, { phone: searchInput }],
          },
          include: [
            {
              model: db.Role,
              as: 'roles',
              include: [
                {
                  model: db.Permission,
                  as: 'permissions',
                },
              ],
            },
            {
              model: db.Route,
              as: 'routes',
              through: {
                attributes: [],
              },
              attributes: ['id', 'label', 'path', 'key', 'icon', 'parent_id'],
              order: [['id', 'ASC']],
            },
          ],
        },
        { raw: true },
      );

      if (!admin) throw new AppError(req.t('admin_not_found'), 200);

      const isEqual = await bcrypt.compare(password, admin.password);
      if (!isEqual) throw new AppError(req.t('incorrect_password'), 200);

      const token = authService.signToken(admin);

      admin.authToken = token;
      await admin.save();

      // get all roles
      const roles = await authService.getRoles(admin.roles);

      // get all permissions for superadmin and get associated permissions for other roles
      const permissions = await authService.getPermissions(
        admin.id,
        admin.roles,
      );

      // get all routes for superadmin and get associated routes for other
      const routes = await authService.controlRoutes(admin.roles, admin.routes);

      const result = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        token: token,
        roles,
        permissions,
        routes,
      };

      return {
        status: 200,
        message: req.t('login_success'),
        data: result,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  logout: async (req) => {
    const admin = await Admin.findByPk(req.authUserId);
    admin.authToken = null;
    await admin.save();
    return {
      status: 200,
      message: req.t('logout_success'),
    };
  },

  signToken: (admin) => {
    return jwt.sign(
      { id: admin.id },
      config.token_secret || 'YANGON_YINXIAGE_YULE_DEVELOPMENT_TEAM',
      {
        expiresIn: config.token_expiresIn,
      },
    );
  },

  controlRoutes: async (roles, routes) => {
    const topLevelRoutes = [];
    const routeMap = new Map();
    const superAdminRoutes = await Route.findAll({
      attributes: ['id', 'label', 'path', 'key', 'icon', 'parent_id'],
    });
    // Check if there is a 'SuperAdmin' role in the array of roles
    const hasSuperAdmin = roles.some((role) => role.name === 'SuperAdmin');

    const checkRoutes = hasSuperAdmin ? superAdminRoutes : routes;

    // First pass: Create a route map and top-level routes
    checkRoutes.forEach((route) => {
      const { id, label, path, key, icon, parent_id } = route;
      const routeData = {
        id,
        label,
        key,
        icon,
        parent_id,
        children: [],
      };

      if (path !== null) {
        routeData.path = path; // Include path only if it's not null
      }

      routeMap.set(id, routeData);

      if (parent_id === null) {
        topLevelRoutes.push(routeData);
      }
    });

    // Second pass: Add child routes to their parent's children array
    checkRoutes.forEach((route) => {
      const { id, parent_id } = route;
      if (parent_id !== null && routeMap.has(parent_id)) {
        routeMap.get(parent_id).children.push(routeMap.get(id));
      }
    });

    // Set children to null for routes without children
    topLevelRoutes.forEach((route) => {
      if (route.children.length === 0) {
        route.children = null;
      }
      // Set children to null for routes without deeper levels of nesting
      else {
        route.children.forEach((child) => {
          if (child.children.length === 0) {
            child.children = null;
          }
        });
      }
    });
    return topLevelRoutes;
  },

  getPermissions: async (admin_id, roles) => {
    const permissions = [];

    // If the admin is a super admin (admin_id === 1), get all permissions
    if (admin_id === 1) {
      const superAdminPermissions = await Permission.findAll({
        attributes: ['name'],
      });

      permissions.push(
        ...superAdminPermissions.map((permission) => permission.name),
      );
    } else {
      // For other admins, query for permissions directly
      const adminPermissions = await Permission.findAll({
        attributes: ['name'],
        include: {
          model: Role,
          as: 'roles',
          where: { id: roles.map((role) => role.id) },
        },
      });

      permissions.push(
        ...adminPermissions.map((permission) => permission.name),
      );
    }

    return permissions;
  },

  getRoles: async (admin_roles) => {
    const roles = [];
    const roleIdsSet = new Set(); // To keep track of unique role IDs

    for (const role of admin_roles) {
      const roleId = role.id;

      if (!roleIdsSet.has(roleId)) {
        const roleInstance = await Role.findByPk(roleId, {
          attributes: ['id', 'name'],
        });

        if (roleInstance) {
          roles.push(roleInstance);
          roleIdsSet.add(roleId); // Add the role ID to the set to mark it as added
        }
      }
    }
    return roles;
  },
};

module.exports = authService;
