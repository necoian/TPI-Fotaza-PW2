const mysql = require('mysql2');
require('dotenv').config();

//pool de conexiones, es para tener varias conexiones abiertas en simultaneo

const pool = mysql.createPool({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0


});

module.exports = pool.promise();