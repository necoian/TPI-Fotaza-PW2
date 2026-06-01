const db = require('../config/db');

exports.index = async (req , res) => {

    try {

        const [registros] = await db.execute('SELECT * FROM images');

        res.render('index' , {fotos : registros});
        
    } catch (error) {
        res.status(500).send("Error al cargar los datos: " + error.message);
    }


}