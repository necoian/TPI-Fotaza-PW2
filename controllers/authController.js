const db = require('../config/db');
const bcrypt = require('bcrypt');


exports.mostrarLogin = (req, res) => {
    res.render('login');
}

exports.procesarLogin = async (req, res) => {

    const {username, password} = req.body;

    try {

        const query = 'SELECT * FROM usuario WHERE username = $1 OR email = $2';

        const resultado = await db.query(query, [username, username]); 
        
        const usuarios = resultado.rows;

        if (usuarios.length === 0) {
            return res.render('login', { error: 'Credenciales inválidas' });
        }

        const usuarioEncontrado = usuarios[0];

        const passwordCampo = usuarioEncontrado.password_hash || usuarioEncontrado.Password_hash;
        const coincidePassword = await bcrypt.compare(password, passwordCampo);

        if (!coincidePassword) {
            return res.render('login', { error: 'Contraseña errónea.' });
        }

        const usernameCampo = usuarioEncontrado.username || usuarioEncontrado.UserName;
        const roleIdCampo = usuarioEncontrado.role_id || usuarioEncontrado.Role_id;

        req.session.usuario = {
            id: usuarioEncontrado.id, 
            UserName: usernameCampo,
            role: roleIdCampo === 1 ? 'Administrador' : 'Usuario'
        };

        res.redirect('/');

    } catch (error) {
        console.error("Error crítico en el proceso de login:", error);
        res.status(500).send('Error desde el servidor');
    }
};

exports.cerrarSesion = (req, res) => {

    req.session.destroy((err) => {
        
        if (err) {
            return res.send('Error al cerrar sesión');
        }
        res.redirect('/'); 
    });
};