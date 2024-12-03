const db = require('../../databases/admin/models');
const Route = db.Route;
// const Permission = db.Permission;
// const RolePermission = db.Role_Has_Permission;
/* eslint-disable no-unused-vars */
const routeService = {
  index: async (req) => {
    try {
      const result = await Route.findAll({
        attributes: ['id', 'label', 'path', 'key', 'icon', 'parent_id'],
        raw: true,
      });

      const topLevelRoutes = [];
      const routeMap = new Map();

      // First pass: Create a route map and top-level routes
      result.forEach((route) => {
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

      // Second pass: Add child routes to their parent's children array
      result.forEach((route) => {
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

      return {
        status: 200,
        message: req.t('route_lists_success'),
        data: topLevelRoutes,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  store: async (req) => {
    // const t = await db.sequelize.transaction();
    try {
      const { label, path, icon, parent_id } = req.body;

      // const checkRoute = await Route.findOne({ where: { label: label } });

      // if (checkRoute) {
      //   throw new Error(req.t('route_name_already_used'));
      // }

      const key = label.toLowerCase().replace(/ /g, '-');

      // const checkRoutefromPermit = await Permission.findOne({ where: { group: key }});

      // if (checkRoutefromPermit) {
      //   throw new Error(req.t('route_name_already_used'));
      // }

      const routeData = {
        label,
        path: path ? path : null,
        key,
        icon,
        parent_id: parent_id ? parent_id : null,
      };

      const route = await Route.create(routeData);
      // const [route, created] = await Route.findOrCreate({
      //   where: { label },
      //   defaults: {
      //     label,
      //     path: path || null,
      //     key,
      //     icon,
      //     parent_id: parent_id || null,
      //   },
      //   transaction: t,
      // });

      // if (created && path) {
      //   const permissionNames = [
      //     `create-${key}`,
      //     `view-${key}`,
      //     `update-${key}`,
      //     `delete-${key}`,
      //   ];

      //   await Permission.bulkCreate(
      //     permissionNames.map((name) => ({
      //       name,
      //       group: key,
      //     })),
      //     { transaction: t },
      //   );
      // }

      // await t.commit();

      return {
        status: 200,
        message: req.t('route_create_success'),
        data: route,
      };
    } catch (error) {
      // await t.rollback();
      throw new Error(error);
    }
  },

  show: async (req) => {
    try {
      const routeId = req.params.id;

      const selectedRoute = await Route.findByPk(routeId, {
        attributes: ['id', 'label', 'path', 'key', 'icon', 'parent_id'],
        include: {
          model: Route,
          as: 'children',
          attributes: ['id', 'label', 'path', 'key', 'icon', 'parent_id'],
        },
      });

      if (!selectedRoute) {
        throw new Error(req.t('route_id_not_found'));
      }

      return {
        status: 200,
        message: req.t('route_view_success'),
        data: selectedRoute,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  update: async (req) => {
    // const t = await db.sequelize.transaction();
    try {
      const routeId = req.params.id;
      const { label, path, icon, parent_id } = req.body;

      const route = await Route.findByPk(routeId);

      if (!route) {
        throw new Error(req.t('route_id_not_found'));
      }

      // if (label !== route.label) {
      //   // Check if the updated name is different from the existing role's name
      //   const existingRoute = await Route.findOne({ where: { label } });
      //   if (existingRoute) {
      //     throw new Error(req.t('route_name_already_used'));
      //   }
      // }

      // if (parent_id) {
      //   // Check if the updated parent ID is not the same as the route's own ID
      //   if (parent_id == routeId) {
      //     throw new Error(req.t('route_cannot_be_its_own_child'));
      //   }

      //   // Check if the updated parent ID is not among the route's own child routes
      //   const childRoutes = await Route.findAll({
      //     where: { parent_id: routeId },
      //   });

      //   for (const childRoute of childRoutes) {
      //     if (childRoute.id == parent_id) {
      //       throw new Error(req.t('route_cannot_have_child_as_parent'));
      //     }
      //   }

      //   // Check if the route has child routes (existing children)
      //   const hasChildren = await Route.findOne({
      //     where: { parent_id: routeId },
      //   });

      //   if (hasChildren) {
      //     throw new Error(req.t('route_cannot_be_child_to_another_route'));
      //   }
      // }

      if (parent_id === routeId) {
        throw new Error(req.t('route_cannot_be_its_own_child'));
      }

      const childRoutes = await Route.findAll({
        where: { parent_id: routeId },
      });

      if (childRoutes.some((childRoute) => childRoute.id === parent_id)) {
        throw new Error(req.t('route_cannot_have_child_as_parent'));
      }

      if (childRoutes.length > 0) {
        throw new Error(req.t('route_cannot_be_child_to_another_route'));
      }

      const key = label.toLowerCase().replace(/ /g, '-');

      const routeData = {
        label,
        path: path ? path : null,
        key,
        icon,
        parent_id: parent_id ? parent_id : null,
      };

      // Check if the path is null (permissions need to be deleted)
      // if (path === null) {
      //   const keyBeforeUpdate = route.key;
      //   const permissionNames = [
      //     `create-${keyBeforeUpdate}`,
      //     `view-${keyBeforeUpdate}`,
      //     `update-${keyBeforeUpdate}`,
      //     `delete-${keyBeforeUpdate}`,
      //   ];

      //   for (const permissionName of permissionNames) {
      //     const permission = await Permission.findOne({
      //       where: { name: permissionName },
      //     });

      //     if (permission) {
      //       // Delete the associated permission from the RolePermission pivot table
      //       await RolePermission.destroy({
      //         where: { permissionId: permission.id },
      //         transaction: t,
      //       });

      //       // Delete the permission
      //       await permission.destroy({ transaction: t });
      //     }
      //   }
      // }

      // if (path) {
      //   const keyBeforeUpdate = route.key;
      //   const currentPermissionNames = [
      //     `create-${key}`,
      //     `view-${key}`,
      //     `update-${key}`,
      //     `delete-${key}`,
      //   ];

      //   const previousPermissionNames = [
      //     `create-${keyBeforeUpdate}`,
      //     `view-${keyBeforeUpdate}`,
      //     `update-${keyBeforeUpdate}`,
      //     `delete-${keyBeforeUpdate}`,
      //   ];

      //   for (let i = 0; i < previousPermissionNames.length; i++) {
      //     const permissionName = previousPermissionNames[i];
      //     const newPermissionName = currentPermissionNames[i];

      //     const permission = await Permission.findOne({
      //       where: { name: permissionName },
      //     });

      //     if (permission) {
      //       // Check if the new permission name already exists
      //       const existingPermission = await Permission.findOne({
      //         where: { name: newPermissionName },
      //       });

      //       if (!existingPermission) {
      //         // Update the existing permission with the new name, group, and key
      //         await permission.update(
      //           { name: newPermissionName, group: key },
      //           { transaction: t },
      //         );
      //       }
      //     } else {
      //       // Check if the new permission name already exists
      //       const existingPermission = await Permission.findOne({
      //         where: { name: newPermissionName },
      //       });

      //       if (!existingPermission) {
      //         await Permission.create(
      //           { name: newPermissionName, group: key },
      //           { transaction: t },
      //         );
      //       }
      //     }
      //   }
      // }

      await route.update(routeData);
      // await t.commit();
      const result = await Route.findByPk(req.params.id, {
        attributes: ['id', 'label', 'path', 'icon', 'parent_id'],
      });

      return {
        status: 200,
        message: req.t('route_update_success'),
        data: result,
      };
    } catch (error) {
      // await t.rollback();
      throw new Error(error);
    }
  },

  delete: async (req) => {
    // const t = await db.sequelize.transaction();
    try {
      const route = await Route.findByPk(req.params.id);
      if (!route) {
        throw new Error(req.t('route_id_not_found'));
      }

      // if (route.path) {
      //   const key = route.key;

      //   // Define the four permission names to be removed
      //   const permissionNames = [
      //     `create-${key}`,
      //     `view-${key}`,
      //     `update-${key}`,
      //     `delete-${key}`,
      //   ];

      //   // Remove the associated permissions
      //   for (const permissionName of permissionNames) {
      //     const permission = await Permission.findOne({
      //       where: { name: permissionName },
      //     });

      //     if (permission) {
      //       await RolePermission.destroy({
      //         where: { permissionId: permission.id },
      //       });
      //       await permission.destroy();
      //     }
      //   }
      // }

      await route.destroy();

      // await t.commit();

      return {
        status: 200,
        message: req.t('route_delete_success'),
      };
    } catch (error) {
      // await t.rollback();
      throw new Error(error);
    }
  },
};

module.exports = routeService;
