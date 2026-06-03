const db = require('../config/db');
const bcrypt = require('bcrypt');


exports.mostrarLogin = (req, res) => {
    res.render('login');
}

exports.procesarLogin = (req, res) => {

    const {userName, password} = req.body;

    try {

        const [usuarios] = await db.execute(
            'SELECT * FROM usuario WHERE UserName = ? OR email = ?', [userName, userName]
        ); //Se pregunta si el username colocado ( tanto sea el username o el email coinciden)

        if (usuarios.length === 0) {
            return res.render('login', {error: 'credenciales invalidas'})
        }

        const usuarioEncontrado = usuarios[0];

        //se compara con el codigo hash
        const coincidePassword = await bcrypt.compare(password, usuarioEncontrado.Password_hash);

        if (!coincidePassword) {
            return res.render('login', { error: 'Contraseña erronea.' });
        }

        req.session.usuario = {
            id: usuarioEncontrado.ID,
            userName: usuarioEncontrado.userName,
            role: usuarioEncontrado.role_id === 1 ? 'Administrador' : 'Usuario'
        }

        res.redirect('/'); //Inicio

    } catch (error) {
        console.error(error);
        res.status(500).send('Error desde el servidor');
    }

};

exports.cerrarSesion = (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.send('Error al cerrar sesión');

        }

        res.redirect('/');//Volvemos a inicio 
    });

};