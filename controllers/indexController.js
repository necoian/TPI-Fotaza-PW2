const db = require('../config/db'); 

exports.index = async (req , res) => {
    try {
        const queryTerm = req.query.search ? req.query.search.trim() : '';
        const usuarioLogueado = req.session && req.session.usuario ? req.session.usuario : null;

        
        let sql = `
            SELECT i.*, p.title, p.description 
            FROM public.images i
            INNER JOIN public.post p ON i.post_id = p.id
            WHERE 1=1
        `;
        const params = [];

        // RESTRICCIÓN DE PRIVACIDAD (los no autenticados solo veran el free)
        if (!usuarioLogueado) {
            sql += ` AND i.license = 'free'`;
        }

        // FILTRO DE BÚSQUEDA
        if (queryTerm !== '') {
            params.push(`%${queryTerm}%`);
            // se busca coincidencias parciales
            sql += ` AND (p.title ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
        }

        // Ordenamos para que aparezcan las más recientes primero
        sql += ` ORDER BY i.created_at DESC`;

        const resultado = await db.query(sql, params);
        const registros = resultado.rows;

        
        res.render('index', { 
            fotos: registros, 
            busqueda: queryTerm 
        });
        
    } catch (error) {
        console.error("Error al cargar las imágenes en la Home:", error);
        res.status(500).send("Error al cargar los datos: " + error.message);
    }
};