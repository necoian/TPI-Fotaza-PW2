require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const app = express();


/*if (!process.env.DB_PASSWORD) {
    console.error("Falta configurar DB_PASSWORD en su archivo .env");
    process.exit(1);
}*/

//Rutas
const indexRoutes = require('./routes/index');

//PUG 
app.set('view engine', 'pug');

//uso de las rutas
app.use('/', indexRoutes);

//Para testear
app.get('/test-db', async (req, res) => {
    try {

        const [rows] = await db.execute('SELECT 1 + 1 AS resultado');
        res.send(`Conexión exitosa: ${rows[0].resultado}`);
    } catch (error) {
        res.status(500).send('Error de conexión: ' + error.message);
    }
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});