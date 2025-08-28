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

// New instance method to fetch all ducks in user's ponds
User.prototype.ducks = async function () {
  const ponds = await Pond.findAll({ where: { userId: this.id } });
  const pondIds = ponds.map(p => p.id);

  const ducks = await Duck.findAll({
    where: { pondId: pondIds },
    include: Pond, 
  });

  return ducks;
};

module.exports = User;
