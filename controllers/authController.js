const { Usuario } = require('../models/Index'); 
const bcrypt = require('bcrypt');

exports.mostrarLogin = (req, res) => {
    res.render('login');
};

exports.procesarLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        
        const { Op } = require('sequelize');
        const usuarioEncontrado = await Usuario.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: username }
                ]
            }
        });

        if (!usuarioEncontrado) {
            return res.render('login', { error: 'Credenciales inválidas' });
        }

        const coincidePassword = await bcrypt.compare(password, usuarioEncontrado.password_hash);

        if (!coincidePassword) {
            return res.render('login', { error: 'Contraseña errónea.' });
        }

        req.session.usuario = {
            id: usuarioEncontrado.id, 
            UserName: usuarioEncontrado.username,
            role: usuarioEncontrado.role_id === 1 ? 'Administrador' : 'Usuario'
        };

        res.redirect('/');

    } catch (error) {
        console.error("Error en el proceso de login:", error);
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