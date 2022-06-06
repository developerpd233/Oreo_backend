const { DataTypes } = require("sequelize");

const sequelize = require("../util/db");

const ContactUs = sequelize.define("contactUs", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  subject: {
    type: DataTypes.STRING,
    allowNull: true,
    default: "",
  },

  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ContactUs;
