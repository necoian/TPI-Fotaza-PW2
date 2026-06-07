const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

router.get('/' , authController.mostrarLogin);

router.post('/', authController.procesarLogin);

router.get('/logout', authController.cerrarSesion);


module.exports = router;