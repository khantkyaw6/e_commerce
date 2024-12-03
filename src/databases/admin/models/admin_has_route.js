'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin_Has_Route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Admin.belongsToMany(models.Route, {
        through: Admin_Has_Route,
        foreignKey: 'adminId',
        as: 'routes',
        onDelete: 'CASCADE',
      });
      models.Route.belongsToMany(models.Admin, {
        through: Admin_Has_Route,
        foreignKey: 'routeId',
        as: 'admins',
        onDelete: 'CASCADE',
      });
    }
  }
  Admin_Has_Route.init(
    {
      adminId: DataTypes.INTEGER,
      routeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Admin_Has_Route',
    },
  );
  return Admin_Has_Route;
};
