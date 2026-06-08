const sequelize = require('../config/db'); 
const { Post, Image, Comment, Usuario } = require('../models/Index');
const cloudinary = require('../config/cloudinary');


exports.verDetalle = async (req, res) => {
    try {
        const postId = req.params.id;
        const usuarioLogueado = req.session && req.session.usuario ? req.session.usuario : null;

        
        const post = await Post.findByPk(postId, {
            include: [
                { 
                    model: Image, 
                    required: false 
                },
                { 
                    model: Comment,
                    required: false,
                    include: [{ model: Usuario, attributes: ['username'] }]
                }
            ]
        });

        if (!post) {
            return res.status(404).send(`Publicación con ID ${postId} no encontrada.`);
        }

        const imagen = post.Images && post.Images.length > 0 ? post.Images[0] : null;

        if (imagen && imagen.license !== 'free' && !usuarioLogueado) {
            return res.render('login', { error: "Debes iniciar sesión para ver esta publicación protegida." });
        }

        
        const listaComentarios = post.Comments || [];
        listaComentarios.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        res.render('detalle', {
            post: post,
            imagen: imagen || { file_path: '', license: 'free', watermark_text: '' },
            comentarios: listaComentarios
        });

    } catch (error) {
        console.error("Error al cargar el detalle del post:", error);
        res.status(500).send("Error interno del servidor: " + error.message);
    }
};


exports.agregarComentario = async (req, res) => {
    try {
        const postId = req.params.id;
        const { text } = req.body;
        const userId = req.session.usuario.id; 

        if (!text || text.trim() === '') {
            
            return res.redirect(`/post/${postId}`);
        }

        
        const post = await Post.findByPk(postId);
        if (!post || !post.comments_open) {
            return res.status(400).send("Los comentarios están cerrados para esta publicación.");
        }

        
        await Comment.create({
            post_id: postId,
            user_id: userId,
            text: text.trim(),
            created_at: new Date()
        });

       
        res.redirect(`/post/${postId}`);

    } catch (error) {
        console.error("Error al guardar el comentario:", error);
        res.status(500).send("No se pudo publicar el comentario.");
    }
};

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