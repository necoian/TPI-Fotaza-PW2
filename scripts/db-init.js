require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const sqlPath = path.join(process.cwd(), 'database', 'schema.sql');
const DB_NAME = (!process.env.DB_NAME || process.env.DB_NAME === 'postgres') ? 'fotaza_db_ian' : process.env.DB_NAME;

function parsearConsultasSql(sqlText) {
    const lines = sqlText.split('\n');
    const queries = [];
    let currentQuery = '';
    let inDollarBlock = false;

    for (let line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('--') || trimmed.startsWith('\\') || trimmed === '') continue;
        if (trimmed.toUpperCase().startsWith('SET ') || trimmed.toUpperCase().startsWith('SELECT PG_CATALOG.SET_CONFIG')) continue;

        currentQuery += line + '\n';
        if (line.includes('$$') || line.includes('$function$')) {
            inDollarBlock = !inDollarBlock;
        }
        if (trimmed.endsWith(';') && !inDollarBlock) {
            if (currentQuery.trim()) queries.push(currentQuery.trim());
            currentQuery = '';
        }
    }
    return queries;
}

async function inicializarEstructura() {
    
    const clientPostgres = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: 'postgres',
    });

    try {
        await clientPostgres.connect();
        const res = await clientPostgres.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`);
        if (res.rowCount === 0) {
            console.log(`Creando base de datos '${DB_NAME}'...`);
            await clientPostgres.query(`CREATE DATABASE ${DB_NAME}`);
        }
    } catch (err) {
        console.error('Error al verificar/crear la base de datos base:', err.message);
    } finally {
        await clientPostgres.end();
    }

   
    const clientFinal = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: DB_NAME,
    });

    try {
        await clientFinal.connect();
        console.log(`Conectado a '${DB_NAME}'. Limpiando esquema anterior`);
        
        

        await clientFinal.query('DROP SCHEMA public CASCADE;');
        await clientFinal.query('CREATE SCHEMA public;');

        console.log('Leyendo archivo schema.sql');
        const sqlTexto = fs.readFileSync(sqlPath, 'utf8');
        const consultas = parsearConsultasSql(sqlTexto);

        console.log(`Ejecutando ${consultas.length} sentencias de estructura`);
        for (let i = 0; i < consultas.length; i++) {
            try {
                await clientFinal.query(consultas[i]);
            } catch (err) {
                if (!consultas[i].toUpperCase().includes('OWNER TO')) {
                    console.warn(`Advertencia en bloque estructura ${i + 1}: ${err.message}`);
                }
            }
        }

        console.log(`\n¡Estructura de '${DB_NAME}' inicializada con éxito!`);
    } catch (error) {
        console.error('Error crítico en db-init:', error.message);
    } finally {
        await clientFinal.end();
    }
}

inicializarEstructura();