const { DataTypes } = require("sequelize");

const sequelize = require("../util/db");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // username: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
