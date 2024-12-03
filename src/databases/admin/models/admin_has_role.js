'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin_Has_Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Admin.belongsToMany(models.Role, {
        through: Admin_Has_Role,
        foreignKey: 'adminId',
        as: 'roles',
        onDelete: 'CASCADE',
      });
      models.Role.belongsToMany(models.Admin, {
        through: Admin_Has_Role,
        foreignKey: 'roleId',
        as: 'admins',
        onDelete: 'CASCADE',
      });
    }
  }
  Admin_Has_Role.init(
    {
      adminId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Admin_Has_Role',
    },
  );
  return Admin_Has_Role;
};
