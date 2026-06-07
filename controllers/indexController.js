const db = require('../config/db'); 

exports.index = async (req , res) => {
    try {
        
        const resultado = await db.query('SELECT * FROM images');
        const registros = resultado.rows;
        res.render('index', { fotos: registros });
        
    } catch (error) {
        console.error("Error al cargar las imágenes en la Home:", error);
        res.status(500).send("Error al cargar los datos: " + error.message);
    }
};