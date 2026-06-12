const sequelize = require('../config/db');
const { Post, Image, Comment, Usuario, Rating, Interested, Follower } = require('../models/Index');
const cloudinary = require('../config/cloudinary');
const { Op } = require('sequelize');

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
        
        const { title, description, license, watermark_text, comments_open } = req.body;
        const usuarioLogueado = req.session.usuario;

        if (!usuarioLogueado) {
            return res.redirect('/login');
        }

        if (!req.file) {
            return res.render('publicar', { 
                error: "Por favor, selecciona una imagen.", 
                datosCompletados: req.body 
            });
        }

        let contenidoImagenFinal = '';

        
        try {
            console.log("Intentando subir imagen a Cloudinary");
            
            const subirACloudinary = (fileBuffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'fotaza_posts', quality: "auto" },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );
                    stream.end(fileBuffer);
                });
            };

            const resultadoCloudinary = await subirACloudinary(req.file.buffer);
            contenidoImagenFinal = resultadoCloudinary.secure_url; 
            console.log("Imagen subida a Cloudinary con éxito. URL:", contenidoImagenFinal);

        } catch (errorCloudinary) {
            
            console.warn("Cloudinary falló. Convirtiendo a Base64");
            
            const tipoMime = req.file.mimetype; 
            const cadenaBase64 = req.file.buffer.toString('base64');
            
            contenidoImagenFinal = `data:${tipoMime};base64,${cadenaBase64}`;
            console.log("Imagen convertida a Base64 con éxito.");
        }

        
        t = await sequelize.transaction();

        const permitirComentarios = req.body.comments_open === 'on' || req.body.comments_open === true || req.body.comments_open === 'true';

        const nuevoPost = await Post.create({
            user_id: usuarioLogueado.id,
            title: title,
            description: description,
            status: 'active',
            comments_open: permitirComentarios,
            created_at: new Date()
        }, {
            transaction: t
        });

        await Image.create({
            post_id: nuevoPost.id,
            file_path: contenidoImagenFinal, 
            license: license || 'free',
            watermark_text: watermark_text || null, 
            order_index: 0,
            created_at: new Date()
        }, { 
            transaction: t 
        });

        
        await t.commit();
        console.log("Publicación guardada en la base de datos exitosamente.");
        
        return res.redirect('/');

    } catch (error) {
        console.error("Error crítico de publicación en Base de Datos:", error.message);
        
        
        if (t && !t.finished) {
            await t.rollback();
        }
        
        return res.render('publicar', { 
            error: `Error al procesar o subir la publicación: ${error.message}`, 
            datosCompletados: req.body 
        });
    }
};

exports.eliminarPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const usuarioLogueado = req.session.usuario;

        if (!usuarioLogueado) {
            return res.redirect('/login');
        }

        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).send("El post no existe.");
        }

        // Tiene que ser el usuario logueado el que elimine el post
        if (post.user_id !== usuarioLogueado.id) {
            return res.status(403).send("No tienes permiso para eliminar esta publicación.");
        }

        await post.destroy();

        res.redirect(`/user/perfil/${usuarioLogueado.id}`);

    } catch (error) {
        console.error("Error al eliminar el post:", error);
        res.status(500).send("Hubo un error al intentar eliminar la publicación.");
    }
};


exports.obtenerHome = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || ''; 
        const usuarioLogueado = req.session && req.session.usuario ? req.session.usuario : null;

        
        const donde = {};
        if (search.trim() !== '') {
            donde[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows: posts } = await Post.findAndCountAll({
            where: donde, 
            limit: limit,
            offset: offset,
            order: [['created_at', 'DESC']], 
            include: [
                { 
                    model: Image, 
                    required: false 
                }
            ]
        });

        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({
                posts: posts,
                tieneMas: offset + limit < count,
                esAutenticado: !!usuarioLogueado
            });
        }

        res.render('index', { 
            postsIniciales: posts, 
            tieneMasInicial: limit < count,
            usuarioLogueado: usuarioLogueado,
            search: search 
        });

    } catch (error) {
        console.error("Error en obtenerHome:", error);
        res.status(500).send("Error al cargar las publicaciones.");
    }
};