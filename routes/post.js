const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { EstaAutenticado } = require('../middlewares/authMiddleware');
const multer = require('multer');

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 } // 8 MB
}).single('imageFile');

router.get('/crear', EstaAutenticado, postController.mostrarFormulario);
router.post('/crear', EstaAutenticado, (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.render('publicar', { 
                    
                    error: "La imagen es demasiado pesada. El tamaño máximo permitido es de 8 MB.",
                    datosCompletados: req.body

                });
            }
            return res.render('publicar', { error: `Error de carga: ${err.message}`, datosCompletados: req.body });
        } else if (err) {
            return res.render('publicar', { error: "Ocurrió un error inesperado al subir el archivo.", datosCompletados: req.body });
        }
        postController.guardarPublicacion(req, res, next);
    });
});


router.get('/:id', postController.verDetalle);


router.post('/:id/comentar', EstaAutenticado, postController.agregarComentario);

router.post('/:id/puntuar', EstaAutenticado, postController.puntuarImagen);

router.post('/:id/interesar', EstaAutenticado, postController.registrarInteres);

module.exports = router;