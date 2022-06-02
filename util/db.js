const Sequelize = require("sequelize");

const sequelize = new Sequelize("payment", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});

// arg1. db name
// arg2. db username
// arg3. db password
// dialect to tell that we are using mysql
// host: dont have to set it explicitly but a good practice

module.exports = sequelize;
