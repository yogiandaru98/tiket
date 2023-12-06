// backend/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('penerbangan', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
