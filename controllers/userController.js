const sequelize = require('../config/db');
const { Post, Image, Comment, Usuario, Rating, Interested, Follower } = require('../models/Index');
const cloudinary = require('../config/cloudinary');

exports.toggleFollow = async (req, res) => {
    try {
        const userIdToFollow = req.params.userId; 
        const usuarioLogueado = req.session.usuario;

        if (!usuarioLogueado) {
            return res.render('login', { 
                error: "Debes iniciar sesión para poder seguir a otros usuarios." 
            });
        }

        if (parseInt(userIdToFollow) === usuarioLogueado.id) {
            
            res.redirect(req.get('referer') || '/');
        }

        const seguimientoExistente = await Follower.findOne({
            where: {
                follower_id: usuarioLogueado.id,
                following_id: userIdToFollow
            }
        });

        if (seguimientoExistente) {
            
            await seguimientoExistente.destroy();
        } else {
            
            await Follower.create({
                follower_id: usuarioLogueado.id,
                following_id: userIdToFollow,
                created_at: new Date()
            });
        }

       
        res.redirect(req.get('referer') || '/');
    } catch (error) {
        console.error("Error en toggleFollow:", error);
        res.status(500).send("Error al procesar el seguimiento.");
    }
};

exports.verPerfil = async (req, res) => {
    
    try {
        const perfilId = req.params.id;

        if (!perfilId || perfilId === 'undefined') {
            console.error("Intento de acceso a perfil sin ID válido");
            return res.status(400).send("ID de usuario no proporcionado correctamente.");
        }

        const usuarioLogueado = req.session && req.session.usuario ? req.session.usuario : null;

        const perfilUsuario = await Usuario.findByPk(perfilId, {
            attributes: ['id', 'username', 'avatar_url']
        });

        if (!perfilUsuario) {
            return res.status(404).send("Usuario no encontrado.");
        }

        
        const seguidoresContador = await Follower.count({ where: { following_id: perfilId } });
        const seguidosContador = await Follower.count({ where: { follower_id: perfilId } });

        const postsUsuario = await Post.findAll({
            where: { user_id: perfilId },
            include: [{ model: Image, required: false }],
            order: [['created_at', 'DESC']]
        });

        let loEstoySiguiendo = false;
        if (usuarioLogueado && usuarioLogueado.id !== parseInt(perfilId)) {
            const existeFollow = await Follower.findOne({
                where: { follower_id: usuarioLogueado.id, following_id: perfilId }
            });
            if (existeFollow) loEstoySiguiendo = true;
        }

        res.render('perfil', {
            perfilUsuario: perfilUsuario ? perfilUsuario.get({ plain: true }) : null,
            seguidoresContador,
            seguidosContador,
            postsUsuario,
            loEstoySiguiendo,
            usuarioLogueado
        });
        
        
    } catch (error) {
        console.error("Error al cargar el perfil:", error);
        res.status(500).send("Error interno al cargar el perfil.");
    }
};

exports.obtenerListaSeguimiento = async (req, res) => {
    try {
        const { id, tipo } = req.params;

        if (tipo === 'seguidores') {
            
            const seguidores = await Follower.findAll({
                where: { following_id: id },
                include: [{
                    model: Usuario,
                    as: 'Seguidor', 
                    attributes: ['username']
                }]
            });
            
            
            const listaNombres = seguidores
                .filter(f => f.Seguidor)
                .map(f => f.Seguidor.username);
                
            return res.json(listaNombres);

        } else if (tipo === 'seguidos') {
            
            const seguidos = await Follower.findAll({
                where: { follower_id: id },
                include: [{
                    model: Usuario,
                    as: 'Siguiendo', 
                    attributes: ['username']
                }]
            });

            const listaNombres = seguidos
                .filter(f => f.Siguiendo)
                .map(f => f.Siguiendo.username);

            return res.json(listaNombres);
        }

        return res.json([]);
    } catch (error) {
        console.error("Error al obtener lista de seguimiento:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};