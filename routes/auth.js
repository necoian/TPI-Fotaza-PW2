const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

const multer = require('multer');

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 4 * 1024 * 1024 } // Límite de 4 MB
}).single('avatarFile');

router.get('/' , authController.mostrarLogin);

router.post('/', authController.procesarLogin);

router.get('/registro', authController.mostrarRegistro);

router.post('/registro', (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.render('registro', { 
                    error: "La imagen de perfil es muy pesada. El tamaño máximo permitido es de 4 MB.",
                    datos: req.body
                });
            }
            return res.render('registro', { error: `Error de carga: ${err.message}`, datos: req.body });
        } else if (err) {
            return res.render('registro', { error: "Ocurrió un error inesperado al subir tu foto.", datos: req.body });
        }
        
        authController.procesarRegistro(req, res, next);
    });
});

router.get('/logout', authController.cerrarSesion);


module.exports = router;