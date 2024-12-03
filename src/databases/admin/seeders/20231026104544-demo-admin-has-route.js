/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Admin_Has_Routes', [
      {
        adminId: 2,
        routeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        adminId: 2,
        routeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        adminId: 2,
        routeId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        adminId: 2,
        routeId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        adminId: 2,
        routeId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        adminId: 2,
        routeId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        adminId: 3,
        routeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admin_Has_Routes', null, {});
  },
};
