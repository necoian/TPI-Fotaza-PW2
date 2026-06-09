const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Interested = sequelize.define('Interested', {
    image_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'image_id',
        references: {
            model: 'images',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'usuario',
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'created_at'
    }
}, {
    tableName: 'interested',
    timestamps: false
});

module.exports = Interested;