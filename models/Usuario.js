const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    avatar_url: {
        type: DataTypes.TEXT, 
        allowNull: true,       
        field: 'avatar_url'    
    }
}, {
    tableName: 'usuario', 
    timestamps: false
});

module.exports = Usuario;