require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

//Triggers
async function ejecutarTriggers(conexion) {
    console.log("Creando triggers");
    
    const triggers = [
        `CREATE TRIGGER after_image_report_insert AFTER INSERT ON image_report 
         FOR EACH ROW 
         BEGIN
            UPDATE POST SET report_count = report_count + 1, is_blocked = 1 
            WHERE Id = (SELECT post_ID FROM IMAGES WHERE ID = NEW.image_id);
         END;`,

        `CREATE TRIGGER after_report_check_limit AFTER INSERT ON image_report 
         FOR EACH ROW 
         BEGIN
            DECLARE v_post_id INT;
            DECLARE v_count INT;
            SELECT post_ID INTO v_post_id FROM IMAGES WHERE ID = NEW.image_id;
            SELECT COUNT(*) INTO v_count FROM IMAGE_REPORT ir 
            JOIN IMAGES i ON ir.image_id = i.ID WHERE i.post_ID = v_post_id;
            IF v_count >= 3 THEN
                INSERT IGNORE INTO VALIDATOR_QUEUE (post_id, status) VALUES (v_post_id, 'pending');
            END IF;
         END;`,

        `CREATE TRIGGER after_post_status_update AFTER UPDATE ON post 
         FOR EACH ROW 
         BEGIN
            DECLARE v_removed_count INT;
            IF NEW.status = 'remove' AND OLD.status != 'remove' THEN
                SELECT COUNT(*) INTO v_removed_count FROM POST 
                WHERE user_id = NEW.user_id AND status = 'remove';
                IF v_removed_count >= 3 THEN
                    UPDATE USUARIO SET is_active = 0 WHERE ID = NEW.user_id;
                END IF;
            END IF;
         END;`
    ];

    for (const sql of triggers) {
        try {
            await conexion.query(sql);
            console.log("Trigger creado correctamente");
        } catch (err) {
            console.error("Error creando trigger:", err.message);
        }
    }
}

//Volcar los datos en las estructuras
async function ejecutarSeeds(conexion) {

    console.log("Cargando los datos a las estructuras");
    const seedsPath = path.join(__dirname, '../database/seeds');

    //leer archivos en orden
    const archivos = fs.readdirSync(seedsPath).sort();

    for (const archivo of archivos) {

        if (archivo.endsWith('.sql')) {

            const filePath = path.join(seedsPath, archivo);
            const sql = fs.readFileSync(filePath, 'utf8');

            try {
                await conexion.query("SET FOREIGN_KEY_CHECKS = 0;  " );
                await conexion.query(sql);
                await conexion.query("SET FOREIGN_KEY_CHECKS = 1; ");

                console.log(`Datos de ${archivo} cargado`);

            } catch (error) {
                console.log(`Error al cargar ${archivo} :`, error.message);
            }

        }


    }
    
}

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

        const dbNombre = process.env.DB_NAME || 'fotaza_db_ian';

        const [rows] = await conexion.query(`SHOW DATABASES LIKE '${dbNombre}'`);
        
        if (rows.length > 0) {
            console.log("La base de datos ya existe.");
            return;
        }

        
        await conexion.query(`CREATE DATABASE \`${dbNombre}\`;`);
        console.log(`Base de Datos '${dbNombre}' en funcionamiento`);

        //seleccionamos la base
        await conexion.query(`USE \`${dbNombre}\`;`);

        //Toda la estructura base de datos ------------------------------
   
        console.log("Por favor aguarde hasta que se cree la estructura");
        const pathBase = path.join(__dirname, '../database/fotaza_db_ian.sql');
        const fotaza_db_ian = fs.readFileSync(pathBase, 'utf8');
        await conexion.query(fotaza_db_ian);

        
        console.log("estructura creada");
        await ejecutarTriggers(conexion); //se colocan aparte porque no se puede ejecutar desde el .sql
        await ejecutarSeeds(conexion); //coloca los datos de las estructuras para ejemplificar el TPI

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