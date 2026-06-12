const { Usuario } = require('../models/Index'); 
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary');

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

exports.mostrarRegistro = (req, res) => {
    res.render('registro'); 
};

exports.procesarRegistro = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const { Op } = require('sequelize');

        
        if (!username || !email || !password) {
            return res.render('registro', { error: 'Los campos usuario, correo y contraseña son obligatorios.', datos: req.body });
        }

        
        const usuarioExistente = await Usuario.findOne({
            where: {
                [Op.or]: [
                    { username: username.trim() },
                    { email: email.trim() }
                ]
            }
        });

        if (usuarioExistente) {
            return res.render('registro', { 
                error: 'El nombre de usuario o el correo electrónico ya están registrados.', 
                datos: req.body 
            });
        }

        // Encriptar contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        
        let avatarFinal = null;

        if (req.file) { 
            try {
                console.log("Subiendo avatar a Cloudinary");
                
                const subirACloudinary = (fileBuffer) => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { folder: 'fotaza_avatares', quality: "auto" },
                            (error, result) => {
                                if (error) return reject(error);
                                resolve(result);
                            }
                        );
                        stream.end(fileBuffer);
                    });
                };

                const resultadoCloudinary = await subirACloudinary(req.file.buffer);
                avatarFinal = resultadoCloudinary.secure_url; 
                console.log("Avatar en Cloudinary listo:", avatarFinal);

            } catch (errorCloudinary) {
                console.warn("Falló Cloudinary en registro. Usando Base64");
                const tipoMime = req.file.mimetype; 
                const cadenaBase64 = req.file.buffer.toString('base64');
                avatarFinal = `data:${tipoMime};base64,${cadenaBase64}`;
            }
        }

        
        await Usuario.create({
            username: username.trim(),
            email: email.trim(),
            password_hash: passwordHash,
            avatar_url: avatarFinal,
            role_id: 2, 
            created_at: new Date()
        });

        res.render('login', { mensajeExito: 'Registrado. Ya puedes iniciar sesión con tu nueva cuenta.' });

    } catch (error) {
        console.error("Error crítico en el proceso de registro:", error);
        res.render('registro', { 
            error: `Ocurrió un error en el servidor: ${error.message}`, 
            datos: req.body 
        });
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