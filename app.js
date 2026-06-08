require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const session = require('express-session');
const app = express();


/*if (!process.env.DB_PASSWORD) {
    console.error("Falta configurar DB_PASSWORD en su archivo .env");
    process.exit(1);
}*/

//Midleware de sesión
app.use(session({

    secret: process.env.SESSION_SECRET || 'clave_secreta',
    resave: false,
    saveUninitialized:  false,
    cookie: {
        secure: false,
        maxAge: 3600000 //tiempo de vida de sesión
    }        

}));

app.use((req, res, next) => { 

    res.locals.usuarioLogueado = req.session.usuario || null;
    next();

});

//Rutas
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

//PUG 
app.set('view engine', 'pug');

//middleware que posibilita la lectura de formularios
app.use(express.urlencoded({extended : true}));
//uso de las rutas
app.use('/', indexRoutes);
app.use('/login', authRoutes);
app.use('/publicar', postRoutes);


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