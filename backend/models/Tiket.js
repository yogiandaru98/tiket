const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Paket = require('./Paket');

class Tiket extends Model {}

Tiket.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    kode_booking: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    tanggal_booking: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    kode_kursi: {
        type: DataTypes.STRING(50),
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
    modelName: 'Tiket',
});

Tiket.belongsTo(User);
Tiket.belongsTo(Paket);



module.exports = Tiket;
