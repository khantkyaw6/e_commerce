/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Admin_Has_Roles', [
      {
        adminId: 1,
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        adminId: 2,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        adminId: 2,
        roleId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        adminId: 3,
        roleId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admin_Has_Roles', null, {});
  },
};
