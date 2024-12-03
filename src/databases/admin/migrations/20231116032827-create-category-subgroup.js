'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CategorySubgroups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subgroupName_en: {
        type: Sequelize.STRING,
      },
      subgroupName_mm: {
        type: Sequelize.STRING,
      },
      subgroupName_zh: {
        type: Sequelize.STRING,
      },
      subgroupImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subgroupImageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      key: {
        type: Sequelize.INTEGER,
      },
      sort: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('CategorySubgroups');
  },
};
