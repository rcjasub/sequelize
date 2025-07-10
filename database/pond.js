const { DataTypes } = require("sequelize");
const db = require("./db");

const Pond = db.define("pond", {
    name: {
        type: DataTypes.STRING,
    },
    size: {
        type: DataTypes.INTEGER,
    }
})

module.exports = Pond;