const bcrypt = require("bcrypt");
const saltRounds = 8;

module.exports = (sequelize, DataTypes) => {
  const UserModelMySQL = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  UserModelMySQL.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
  });
  return UserModelMySQL;
};
