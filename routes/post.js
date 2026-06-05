const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const {EstaAutenticado} = require('../middlewares/authMiddleware');
//servirá para guardar las imagenes temporalmente en la RAM, porque se necesita subir a un servidor de terceros
const multer = require('multer');

//lo limito porque cloudinary en mi plan gratuito solo me permite subir como maximo 10 megas de archivo
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 8 * 1024 * 1024 // 8 MB
    }
}).single('imageFile');


router.get('/', EstaAutenticado, postController.mostrarFormulario);

router.post('/', EstaAutenticado, (req, res, next) => {
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

module.exports = router;