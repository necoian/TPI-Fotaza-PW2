require('dotenv').config();
const express = require('express');
const db = require('./config/db'); 
const session = require('express-session');
const app = express();

// Middleware de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000 // tiempo de vida de sesión
    }        
}));

app.use((req, res, next) => { 
    res.locals.usuarioLogueado = req.session.usuario || null;
    next();
});

// Rutas - Importación
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

// const commentRoutes = require('./routes/comment'); 

// PUG 
app.set('view engine', 'pug');

//para archivos estaticos como css
app.use(express.static('public'));

// Middleware que posibilita la lectura de formularios
app.use(express.urlencoded({ extended: true }));

// Uso de las rutas
app.use('/', indexRoutes);
app.use('/login', authRoutes);
app.use('/post', postRoutes);
// rutas de comentarios
// app.use('/', commentRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});