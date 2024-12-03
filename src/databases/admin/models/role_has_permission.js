'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role_Has_Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Role.belongsToMany(models.Permission, {
        through: Role_Has_Permission,
        foreignKey: 'roleId',
        as: 'permissions',
        onDelete: 'CASCADE',
      });
      models.Permission.belongsToMany(models.Role, {
        through: Role_Has_Permission,
        foreignKey: 'permissionId',
        as: 'roles',
        onDelete: 'CASCADE',
      });
    }
  }
  Role_Has_Permission.init(
    {
      roleId: DataTypes.INTEGER,
      permissionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Role_Has_Permission',
    },
  );
  return Role_Has_Permission;
};
