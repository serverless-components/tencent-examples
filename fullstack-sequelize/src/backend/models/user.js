const { DataTypes } = require('sequelize');
const Model = require('sequelize/lib/model');

class User extends Model {}

const initUser = (sequelize) => {
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      site: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      moduleName: 'users',
    },
  );
};

module.exports = {
  User,
  initUser,
};
