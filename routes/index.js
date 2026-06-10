
const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/', postController.obtenerHome);

module.exports = router;