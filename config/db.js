const { Pool } = require('pg');
require('dotenv').config();

let pool;

// Validamos si existe la URL completa en el archivo .env
if (process.env.DATABASE_URL) {
    console.log("Conectando a la Base de Datos mediante DATABASE_URL...");
    pool = new Pool({
        connectionString: process.env.DATABASE_URL.trim(),
        ssl: {
            rejectUnauthorized: false 
        }
    });
} else {
    console.log("Conectando a la Base de Datos mediante localhost");
    pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
}

module.exports = pool;