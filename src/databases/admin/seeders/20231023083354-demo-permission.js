/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Permissions', [
      // Menus || Routes
      {
        name: 'create-menu-management',
        group: 'menu-management',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'view-menu-management',
        group: 'menu-management',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'update-menu-management',
        group: 'menu-management',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'delete-menu-management',
        group: 'menu-management',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Permissions
      {
        name: 'create-permission-management',
        group: 'permission-management',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'view-permission-management',
        group: 'permission-management',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'update-permission-management',
        group: 'permission-management',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'delete-permission-management',
        group: 'permission-management',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Roles
      {
        name: 'create-role',
        group: 'role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'view-role',
        group: 'role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'update-role',
        group: 'role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'delete-role',
        group: 'role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Users
      {
        name: 'create-user',
        group: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'view-user',
        group: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'update-user',
        group: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'delete-user',
        group: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Tags
      {
        name: 'create-tag',
        group: 'tag',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'view-tag',
        group: 'tag',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'update-tag',
        group: 'tag',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'delete-tag',
        group: 'tag',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Category
      {
        name: 'create-category',
        group: 'category',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'view-category',
        group: 'category',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'update-category',
        group: 'category',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'delete-category',
        group: 'category',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Category's Subgroup
      {
        name: 'create-categorysubgroup',
        group: 'categorysubgroup',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'view-categorysubgroup',
        group: 'categorysubgroup',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'update-categorysubgroup',
        group: 'categorysubgroup',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'delete-categorysubgroup',
        group: 'categorysubgroup',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Subcategory
      {
        name: 'create-subcategory',
        group: 'subcategory',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'view-subcategory',
        group: 'subcategory',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'update-subcategory',
        group: 'subcategory',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'delete-subcategory',
        group: 'subcategory',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Brand
      {
        name: 'create-brand',
        group: 'brand',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'view-brand',
        group: 'brand',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'update-brand',
        group: 'brand',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'delete-brand',
        group: 'brand',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Permissions', null, {});
  },
};
