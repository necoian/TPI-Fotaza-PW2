require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

//Inicializamos la base de datos 
async function inicializarBD() {

    let conexion;

    try {

        console.log("Se inicializa la configuracion de la base de datos");

        conexion = await mysql.createConnection({

            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true

        });

        const dbNombre = process.env.DB_NAME || 'fotaza_db';
        await conexion.query(`CREATE DATABASE IF NOT EXISTS \`${dbNombre}\`;`);
        console.log(`Base de Datos '${dbNombre}' en funcionamiento`);

        //seleccionamos la base
        await conexion.query(`USE \`${dbNombre}\`;`);

        //Toda la estructura base de datos ------------------------------

        const pathBase = path.join(__dirname, 'fotaza_db.sql');
        const fotaza_db = fs.readFileSync(pathBase, 'utf8');
        await conexion.query(fotaza_db);
        console.log("Estructura de la base en funcionamiento");

        //fin estructura base de datos ------------------------------


    } catch (error) {
        console.error("Error en inicializar la bd, detalles: ", error.message);
    } finally {
        if (conexion) {
            await conexion.end();
        }
        process.exit();
    }
    
}

inicializarBD();