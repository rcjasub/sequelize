const db = require("./db");
const User = require("./user");
const Pond = require("./pond")
const Duck = require("./duck");

// Associations
User.hasMany(Pond);
Pond.belongsTo(User);

Pond.hasMany(Duck);
Duck.belongsTo(Pond);

module.exports = {
  db,
  User,
  Pond,
  Duck,
};
