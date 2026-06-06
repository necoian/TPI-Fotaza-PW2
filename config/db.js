const { Pool } = require('pg');
require('dotenv').config();

let pool;

// Si existe DATABASE_URL, nos conectamos a Supabase 
if (process.env.DATABASE_URL) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } 
    });
    console.log("Conectado de manera online");
} else {
    // Si no existe, nos conectamos al Postgres local
    pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'fotaza_db_ian'
    });

    console.log("Conectado al PostgreSQL de manera Local");
}


module.exports = pool;