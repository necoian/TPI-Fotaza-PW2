const express = require('express');

const router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/' , indexController.login);


module.exports = router;