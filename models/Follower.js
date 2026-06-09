const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Follower = sequelize.define('Follower', {
    follower_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'follower_id',
        references: { model: 'usuario', key: 'id' }
    },
    following_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'following_id',
        references: { model: 'usuario', key: 'id' }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'created_at'
    }
}, {
    tableName: 'followers',
    timestamps: false
});

module.exports = Follower;