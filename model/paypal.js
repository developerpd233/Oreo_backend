const { DataTypes } = require("sequelize");

const sequelize = require("../util/db");

const PaypalForm = sequelize.define("aypalForm", {
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
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    default: "Unpaid",
  },
  link: DataTypes.STRING,
  paymentID: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  payerID: DataTypes.STRING,
});

module.exports = PaypalForm;