/* eslint-disable no-unused-vars */
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Permission.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue('name', value.toLowerCase());
        },
      },
      group: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue('group', value.toLowerCase());
        },
      },
    },
    {
      sequelize,
      modelName: 'Permission',
    },
  );
  return Permission;
};
