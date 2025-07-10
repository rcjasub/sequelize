const { DataTypes } = require("sequelize");
const db = require("./db");
const Pond = require("./pond")
const Duck = require("./duck");
const bcrypt = require("bcrypt");

const User = db.define("user", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 20],
    },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Instance method to check password
User.prototype.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// Class method to hash password
User.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

User.prototype.getAllDucks = async function () {
  const ducks = await Duck.findAll({
    include: [{
      model: Pond,
      where: { userId: this.id },  
    }]
  });

  return ducks
}

module.exports = User;
