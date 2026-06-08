const sequelize = require('../config/db'); 
const { Post, Image } = require('../models/Index');
const cloudinary = require('../config/cloudinary');

exports.mostrarFormulario = (req, res) => {
    res.render('publicar');
};

exports.guardarPublicacion = async (req, res) => {
    let contenidoImagen = null;
    let t = null; 

    try {
        const { title, description, license, watermarkText } = req.body;
        const userId = req.session && req.session.usuario ? req.session.usuario.id : null;

        if (!req.file) {
            return res.render('publicar', { error: "Debes seleccionar un archivo de imagen obligatoriamente" });
        }

        if (!userId) {
            return res.render('publicar', { error: "Tu sesión ha expirado. Inicia sesión nuevamente" });
        }

        const tieneCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY;

        if (tieneCloudinary) {
            const subirACloudinary = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'Inicio/PWII' },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );
                    stream.end(req.file.buffer);
                });
            };

            const resultadoCloudinary = await subirACloudinary();
            contenidoImagen = resultadoCloudinary.secure_url || resultadoCloudinary.url || null;
        } else {
            const imagenBase64 = req.file.buffer.toString('base64');
            const mimeType = req.file.mimetype; 
            contenidoImagen = `data:${mimeType};base64,${imagenBase64}`;
        }

        if (!contenidoImagen) {
            throw new Error("No se pudo procesar el contenido de la imagen");
        }

        
        t = await sequelize.transaction();

        
        const nuevoPost = await Post.create({
            user_id: userId,
            title: title,
            description: description,
            status: 'active',
            comments_open: true,
            created_at: new Date()
        }, { transaction: t });

        
        await Image.create({
            post_id: nuevoPost.id,
            file_path: contenidoImagen,
            license: license,
            watermark_text: watermarkText,
            order_index: 0,
            created_at: new Date()
        }, { transaction: t });

        
        await t.commit();
        console.log("Publicación guardada");

        res.redirect('/');

    } catch (error) {
        console.error("Error en el controlador de publicaciones:", error.message);
        
        
        if (t) await t.rollback();

        res.render('publicar', {
            error: `Ocurrió un error al procesar la publicación: (${error.message})`,
            datosCompletados: req.body
        });
    }
};