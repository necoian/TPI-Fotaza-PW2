const { Image, Post } = require('../models/Index');
const { Op } = require('sequelize');

exports.index = async (req, res) => {
    try {
        const queryTerm = req.query.search ? req.query.search.trim() : '';
        const usuarioLogueado = req.session && req.session.usuario ? req.session.usuario : null;


        let whereImage = {};
        if (!usuarioLogueado) {
            whereImage.license = 'free'; // RESTRICCIÓN DE PRIVACIDAD
        }


        let wherePost = {};
        if (queryTerm !== '') {
            wherePost[Op.or] = [
                { title: { [Op.iLike]: `%${queryTerm}%` } },
                { description: { [Op.iLike]: `%${queryTerm}%` } }
            ];
        }

        // Consulta unificada mediante ORM
        const registros = await Image.findAll({
            where: whereImage,
            include: [{
                model: Post,
                where: wherePost,
                required: true // Esto fuerza un INNER JOIN estricto
            }],
            order: [['created_at', 'DESC']]
        });

        const fotosAdaptadas = registros.map(reg => {
            return {
                id: reg.post_id,
                id_imagen: reg.id,
                file_path: reg.file_path,
                license: reg.license,
                watermark_text: reg.watermark_text,
                title: reg.Post.title,
                description: reg.Post.description
            };
        });

        res.render('index', {
            fotos: fotosAdaptadas,
            busqueda: queryTerm
        });

    } catch (error) {
        console.error("Error al cargar las imágenes en la Home:", error);
        res.status(500).send("Error al cargar los datos: " + error.message);
    }
};