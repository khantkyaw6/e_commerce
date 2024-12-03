/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Admins', [
      {
        name: 'Super Admin',
        email: 'superadmin@gmail.com',
        password: bcrypt.hashSync('YYY2023@dmin', 8),
        phone: '09123456789',
        authToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Developer',
        email: 'developer@gmail.com',
        password: bcrypt.hashSync('YYY2023@developer', 8),
        phone: '09987654321',
        authToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Manager',
        email: 'manager@gmail.com',
        password: bcrypt.hashSync('YYY2023@manager', 8),
        phone: '09876543219',
        authToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admins', null, {});
  },
};
