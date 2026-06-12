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

    
    const clientControl = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: 'postgres',
    });

    try {
        await clientControl.connect();
        const res = await clientControl.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`);
        if (res.rowCount === 0) {
            console.error(`\nerror: La base de datos '${DB_NAME}' no existe localmente.`);
            console.error(`Por favor, ejecuta primero: npm run db:init\n`);
            process.exit(1);
        }
    } catch (err) {
        console.error('Error al verificar la existencia de la base de datos:', err.message);
        process.exit(1);
    } finally {
        await clientControl.end();
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
        console.log(`Conectado a '${DB_NAME}'.`);

        
        console.log('Vaciando tablas existentes');
        
        const tablasRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        `);

        if (tablasRes.rowCount > 0) {
            const listaTablas = tablasRes.rows.map(r => `public."${r.table_name}"`).join(', ');
            
            await client.query(`TRUNCATE TABLE ${listaTablas} RESTART IDENTITY CASCADE;`);

            console.log('Tablas limpiadas exitosamente');
        }

        
        console.log('Leyendo semillas (seeds.sql)');
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

        console.log(`Insertando ${comandosInsert.length} registros de prueba de las semillas`);
        
        
        await client.query('SET CONSTRAINTS ALL DEFERRED;');

        for (let i = 0; i < comandosInsert.length; i++) {
            try {
                await client.query(comandosInsert[i]);
            } catch (err) {
                
                if (!comandosInsert[i].toUpperCase().includes('SETVAL')) {
                    console.error(`Error insertando semilla fila ${i + 1}:`, err.message);
                }
            }
        }

        console.log('\nDatos de prueba (Seeds) cargados con éxito');
    } catch (error) {
        console.error('Error en db-seeds:', error.message);
    } finally {
        await client.end();
    }
}

cargarSemillas();