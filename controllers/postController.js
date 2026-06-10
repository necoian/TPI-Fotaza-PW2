const sequelize = require('../config/db');
const { Post, Image, Comment, Usuario, Rating, Interested, Follower } = require('../models/Index');
const cloudinary = require('../config/cloudinary');

exports.verDetalle = async (req, res) => {
    try {
        const postId = req.params.id;
        const usuarioLogueado = req.session && req.session.usuario ? req.session.usuario : null;

        const post = await Post.findByPk(postId, {
            include: [
                { model: Image, required: false },
                { model: Usuario, attributes: ['id', 'username', 'avatar_url'] },
                {
                    model: Comment,
                    required: false,
                    include: [{ model: Usuario, attributes: ['id','username'] }]
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

        let promedioEstrellas = 0;
        let yaInteresado = false;

        if (imagen) {
            
            const [resultado] = await sequelize.query(
                'SELECT AVG(score) AS promedio FROM ratings WHERE image_id = :idImagen',
                {
                    replacements: { idImagen: imagen.id },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            
            if (resultado && resultado.promedio) {
                promedioEstrellas = parseFloat(resultado.promedio).toFixed(1);
            }

            
            if (usuarioLogueado) {
                const interesExistente = await Interested.findOne({
                    where: {
                        image_id: imagen.id,
                        user_id: usuarioLogueado.id
                    }
                });
                if (interesExistente) {
                    yaInteresado = true;
                }
            }
        }

        let loEstoySiguiendo = false;

        if (usuarioLogueado && post.Usuario) {
           
            if (usuarioLogueado.id !== post.Usuario.id) {
                const existeFollow = await Follower.findOne({
                    where: {
                        follower_id: usuarioLogueado.id,
                        following_id: post.Usuario.id
                    }
                });
                if (existeFollow) {
                    loEstoySiguiendo = true;
                }
            }
        }

        
        res.render('detalle', {
            post: post,
            imagen: imagen || { id: null, file_path: '', license: 'free', watermark_text: '' },
            comentarios: listaComentarios,
            promedioEstrellas: promedioEstrellas,
            yaInteresado: yaInteresado,
            loEstoySiguiendo: loEstoySiguiendo, 
            usuarioLogueado: usuarioLogueado     
        });


    } catch (error) {
        console.error("Error al cargar el detalle del post:", error);
        res.status(500).send("Error interno del servidor: " + error.message);
    }
};

// Controlador para guardar un comentario
exports.agregarComentario = async (req, res) => {
    try {
        const postId = req.params.id;
        const { text } = req.body;
        const usuarioLogueado = req.session.usuario;

        if (!usuarioLogueado) {
            return res.status(401).send("No autorizado.");
        }

        await Comment.create({
            post_id: postId,
            user_id: usuarioLogueado.id,
            text: text,
            is_deleted: false,
            created_at: new Date()
        });

        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.error("Error al agregar comentario:", error);
        res.status(500).send("Error al procesar el comentario.");
    }
};


exports.puntuarImagen = async (req, res) => {
    try {
        const postId = req.params.id;
        const { stars } = req.body; 
        const usuarioLogueado = req.session.usuario;

        const imagen = await Image.findOne({ where: { post_id: postId } });
        if (!imagen) {
            return res.status(404).send("Imagen no encontrada para este post.");
        }

        
        const [ratingObj, creado] = await Rating.findOrCreate({
            where: {
                image_id: imagen.id,
                user_id: usuarioLogueado.id
            },
            defaults: {
                score: parseInt(stars), 
                created_at: new Date()
            }
        });

        if (!creado) {
            
            ratingObj.score = parseInt(stars);
            await ratingObj.save();
        }

        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.error("Error al puntuar la imagen:", error);
        res.status(500).send("Error al registrar tu calificación.");
    }
};

//like
exports.registrarInteres = async (req, res) => {
    try {
        const postId = req.params.id;
        const usuarioLogueado = req.session.usuario;

        if (!usuarioLogueado) {
            return res.status(401).send("Debes iniciar sesión para darle like.");
        }

        
        const imagen = await Image.findOne({ where: { post_id: postId } });
        if (!imagen) {
            return res.status(404).send("Imagen no encontrada para este post.");
        }

       
        const interesExistente = await Interested.findOne({
            where: {
                image_id: imagen.id,
                user_id: usuarioLogueado.id
            }
        });

        if (interesExistente) {
            
            await interesExistente.destroy();
        } else {
            
            await Interested.create({
                image_id: imagen.id,
                user_id: usuarioLogueado.id,
                created_at: new Date()
            });
        }

        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.error("Error al registrar interés:", error);
        res.status(500).send("Error al procesar la solicitud de interés.");
    }
};


exports.mostrarFormulario = (req, res) => {
    res.render('publicar', { error: null, datosCompletados: null });
};


exports.guardarPublicacion = async (req, res) => {
    let t;
    try {
        const { title, description, license, watermarkText } = req.body;
        const userId = req.session.usuario.id;

        if (!req.file) {
            return res.render('publicar', { error: "Debes seleccionar un archivo de imagen.", datosCompletados: req.body });
        }

        let contenidoImagen = null;
        //MUY IMPORTANTE, SI NO TIENE LAS CREDENCIALES CLOUDINARY SE GUARDARA EN BASE64
        if (process.env.CLOUDINARY_URL) {
            const resultadoCloudinary = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: 'fotaza' }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end(req.file.buffer);
            });
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
        res.redirect('/');

    } catch (error) {
        console.error("Error de publicacion:", error.message);
        if (t) await t.rollback();
        res.render('publicar', { error: error.message, datosCompletados: req.body });
    }
};