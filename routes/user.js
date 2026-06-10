const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { EstaAutenticado } = require('../middlewares/authMiddleware');

router.post('/follow/:userId', EstaAutenticado, userController.toggleFollow);
router.get('/perfil/:id', userController.verPerfil);
router.get('/lista/:id/:tipo', userController.obtenerListaSeguimiento);

module.exports = router;
