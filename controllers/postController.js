const db = require('../config/db');
const cloudinary = require('../config/cloudinary');

exports.mostrarFormulario = (req, res) => {

    res.render('publicar');

}

exports.guardarPublicacion = async (req, res) => {

    const { title, description, license, watermarkText} = req.body;
    const userId = req.session && req.session.usuario ? req.session.usuario.id : null;

    let conexion = null;
    let urlImagenReal = null;

    if (!req.file) {
        return res.status(400).send("Se debe seleccionar una imagen para subir");
    }


    try {

        console.log("=== DATOS RECIBIDOS EN EL CONTROLADOR ===");
        console.log("title:", title);
        console.log("description:", description);
        console.log("license:", license);
        console.log("watermarkText:", watermarkText);
        console.log("userId:", userId);
        console.log("=========================================");

        const subirACloudinary = () => {
            console.log("Iniciando transferencia a Cloudinary");
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'Inicio/PWII' }, // Carpeta donde se guardará en Cloudinary
                    (error, result) => {
                        if (error) {
                            console.error("Error directo de Cloudinary:", error);
                            return reject(error);

                        } 
                        console.log("Cloudinary dio el okey");
                        resolve(result);
                    }
                );
                if (req.file && req.file.buffer) {
                    stream.end(req.file.buffer);
                } else {
                    reject(new Error("No hay buffer de archivo disponible"));
                }
            });
        };

        
        const resultadoCloudinary = await subirACloudinary();

        
        console.log("=== RESPUESTA DE CLOUDINARY ===");
        console.log(resultadoCloudinary);
        console.log("========================================");

        
        urlImagenReal = resultadoCloudinary.secure_url || resultadoCloudinary.url || null; 

        
        if (!urlImagenReal) {
            throw new Error("Cloudinary no devolvió una URL válida para la imagen");
        }

        conexion = await db.getConnection();
        await conexion.beginTransaction();
        //consulta SQL para insertar el post
        const queryPost = `
            INSERT INTO post (user_id, title, description, status, comments_open, created_at) 
            VALUES (?, ?, ?, 'active', 1, NOW())
        `;
        //se ejecuta la orden
        const [resultadoPost] = await conexion.execute(queryPost, [
            userId, 
            title, 
            description
        ]);

        const nuevoPostId = resultadoPost.insertId;

        //para la imagen
        const queryImage = `
            INSERT INTO images (post_ID, file_path, license, watermark_text, order_index, created_at) 
            VALUES (?, ?, ?, ?, 0, NOW())
        `;

        await conexion.execute(queryImage, [
            nuevoPostId, 
            urlImagenReal, 
            license, 
            watermarkText
        ]);

        await conexion.commit();
        console.log("Post guardado de forma completa en la Base de Datos");
        conexion.release();

        res.redirect('/');


    } catch (error) {

        console.error("Error en el controlador:", error.message);

        if (conexion) await conexion.rollback(); //regresa cambios de conexion

        let mensaje = "Ocurrió un error al procesar la publicación.";
        if (error.message.includes("Bind parameters must not contain undefined")) {
            mensaje = "Error interno: Faltan parámetros para la base de datos.";
        }

        res.render('publicar', { 
            error: `${mensaje} (${error.message})`,
            datosCompletados: req.body 
        });

    }
    finally {
        if(conexion) {
            conexion.release();
        }
    }

    
};