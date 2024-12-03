/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Role_Has_Permissions', [
      {
        roleId: 2,
        permissionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 13,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        permissionId: 16,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Role_Has_Permissions', null, {});
  },
};
