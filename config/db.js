const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
    console.log("Produccion");
    sequelize = new Sequelize(process.env.DATABASE_URL.trim(), {
        dialect: 'postgres',
        logging: false, 
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false 
            }
        }
    });
} else {
    console.log("Entorno local");
    sequelize = new Sequelize(
        process.env.DB_NAME,     
        process.env.DB_USER,     
        process.env.DB_PASSWORD, 
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: console.log 
        }
    );
}


sequelize.authenticate()
    .then(() => console.log('Conexión establecida'))
    .catch(err => console.error('Error al conectar con la base de datos', err));

module.exports = sequelize;