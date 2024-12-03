'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Subcategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subcategoryName_en: {
        type: Sequelize.STRING,
      },
      subcategoryName_mm: {
        type: Sequelize.STRING,
      },
      subcategoryName_zh: {
        type: Sequelize.STRING,
      },
      subcategoryImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subcategoryImageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      categorySubgroupId: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Subcategories');
  },
};
