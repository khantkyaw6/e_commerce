'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      categoryName_en: {
        type: Sequelize.STRING,
      },
      categoryName_mm: {
        type: Sequelize.STRING,
      },
      categoryName_zh: {
        type: Sequelize.STRING,
      },
      categoryIcon: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      categoryImageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      key: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('Categories');
  },
};
