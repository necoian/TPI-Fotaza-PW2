require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const sqlPath = path.join(process.cwd(), 'database', 'seeds.sql');
const DB_NAME = (!process.env.DB_NAME || process.env.DB_NAME === 'postgres') ? 'fotaza_db_ian' : process.env.DB_NAME;

async function cargarSemillas() {
    if (!fs.existsSync(sqlPath)) {
        console.error(`Error: No se encontró el archivo de semillas en ${sqlPath}.`);
        process.exit(1);
    }

    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: DB_NAME,
    });

    try {
        await client.connect();
        console.log(`Conectado a '${DB_NAME}'. Leyendo semillas (seeds.sql)`);
        
        const sqlTexto = fs.readFileSync(sqlPath, 'utf8');
        
        const lineas = sqlTexto.split('\n');
        let comandosInsert = [];
        let comandoActual = '';

        for (let linea of lineas) {
            const trimmed = linea.trim();
            if (trimmed.startsWith('--') || trimmed === '') continue;
            
            comandoActual += linea + '\n';
            if (trimmed.endsWith(';')) {
                comandosInsert.push(comandoActual.trim());
                comandoActual = '';
            }
        }

        console.log(`Insertando ${comandosInsert.length} registros de prueba...`);
        
        
        await client.query('SET CONSTRAINTS ALL DEFERRED;');

        for (let i = 0; i < comandosInsert.length; i++) {
            try {
                await client.query(comandosInsert[i]);
            } catch (err) {
                console.error(`Error insertando semilla fila ${i + 1}:`, err.message);
            }
        }

        console.log('\n¡Datos de prueba (Seeds) cargados');
    } catch (error) {
        console.error('Error crítico en db-seeds:', error.message);
    } finally {
        await client.end();
    }
}

cargarSemillas();