require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const sqlPath = path.join(process.cwd(), 'database', 'fotaza_db_ian.sql');
const DB_NAME = (!process.env.DB_NAME || process.env.DB_NAME === 'postgres') ? 'fotaza_db_ian' : process.env.DB_NAME;

function parsearConsultasSql(sqlText) {
    const lines = sqlText.split('\n');
    const queries = [];
    let currentQuery = '';
    let inDollarBlock = false;

    for (let line of lines) {
        const trimmed = line.trim();

        if (trimmed.startsWith('--') || trimmed.startsWith('\\') || trimmed === '') {
            continue;
        }

        if (trimmed.toUpperCase().startsWith('SET ') || trimmed.toUpperCase().startsWith('SELECT PG_CATALOG.SET_CONFIG')) {
            continue;
        }

        currentQuery += line + '\n';

        if (line.includes('$$') || line.includes('$function$')) {
            inDollarBlock = !inDollarBlock;
        }

        if (trimmed.endsWith(';') && !inDollarBlock) {
            if (currentQuery.trim()) {
                queries.push(currentQuery.trim());
            }
            currentQuery = '';
        }
    }

    if (currentQuery.trim()) {
        queries.push(currentQuery.trim());
    }
    return queries;
}

async function inicializarBaseDeDatos() {
    const clientInicial = new Client({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: 'postgres',
        port: process.env.DB_PORT || 5432,
    });

    try {
        console.log('Leyendo archivo SQL local');
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`No se encontró el archivo SQL en: ${sqlPath}`);
        }
        const sqlTexto = fs.readFileSync(sqlPath, 'utf8');

        console.log('Conectando al servidor Postgres local');
        await clientInicial.connect();

        console.log(`Recreando base de datos desde cero (${DB_NAME})`);
        await clientInicial.query(`
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = '${DB_NAME}' AND pid <> pg_backend_pid();
        `);
        await clientInicial.query(`DROP DATABASE IF EXISTS ${DB_NAME};`);
        await clientInicial.query(`CREATE DATABASE ${DB_NAME};`);
        await clientInicial.end();

        console.log(`Conectando a la nueva base de datos '${DB_NAME}'`);
        const clientFinal = new Client({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD,
            database: DB_NAME,
            port: process.env.DB_PORT || 5432,
        });

        await clientFinal.connect();

        console.log('trigger');
        // Creamos las funciones en el Postgres local antes de leer el archivo .sql
        await clientFinal.query(`
            CREATE OR REPLACE FUNCTION public.fn_after_image_report_insert()
            RETURNS trigger LANGUAGE plpgsql AS $$
            DECLARE
                v_post_id integer;
            BEGIN
                SELECT post_id INTO v_post_id FROM public.images WHERE id = NEW.image_id;
                IF v_post_id IS NOT NULL THEN
                    UPDATE public.post SET report_count = report_count + 1 WHERE id = v_post_id;
                END IF;
                RETURN NEW;
            END; $$;
        `);

        await clientFinal.query(`
            CREATE OR REPLACE FUNCTION public.fn_after_post_status_update()
            RETURNS trigger LANGUAGE plpgsql AS $$
            BEGIN
                IF NEW.status = 'pending' THEN
                    INSERT INTO public.validator_queue (post_id, status)
                    VALUES (NEW.id, 'pending')
                    ON CONFLICT (post_id) DO NOTHING;
                END IF;
                RETURN NEW;
            END; $$;
        `);

        console.log('Procesando e insertando sentencias SQL');
        const consultas = parsearConsultasSql(sqlTexto);

        for (let i = 0; i < consultas.length; i++) {
            try {
                await clientFinal.query(consultas[i]);
            } catch (err) {
                if (!consultas[i].toUpperCase().includes('OWNER TO')) {
                    console.warn(`Advertencia en bloque ${i + 1}: ${err.message}`);
                }
            }
        }

        console.log(`\nBase de datos local '${DB_NAME}' finalizado con exito`);
        await clientFinal.end();

    } catch (error) {
        console.error('Error:', error.message);
        try { await clientInicial.end(); } catch (_) { }
    }
}

inicializarBaseDeDatos();