const Sequelize = require('sequelize');
require('dotenv').config();

const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = process.env;

module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT || 3306,
  dialect: 'mysql',
  connectionTimeout: 0,
  pool: {
    max: 1000,
    min: 0,
    acquire: 200000,
    idle: 200000
  },
  dialectOptions: {
    decimalNumbers: true,
    socketPath: "/cloudsql/disco-glass-214019:us-central1:easy-allies"
  },
  define: {
    freezeTableName: true,
    timestamps: false
  }
});
