/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [
      {
        name: 'SuperAdmin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Developer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  },
};
