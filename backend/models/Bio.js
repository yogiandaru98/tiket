// Bio.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Bio extends Model {}

Bio.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  alamat: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  no_hp: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  jenis_kelamin: {
    type: DataTypes.ENUM('Laki-laki', 'Perempuan'),
    allowNull: false,
  },
  
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Bio',
});

Bio.belongsTo(User);

module.exports = Bio;
