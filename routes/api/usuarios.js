var express = require('express');
var router = express.Router();
var usuarioController = require('../../controllers/api/usuarioControllerAPI');

router.get('/', usuarioController.usuario_list);
router.post('/create', usuarioController.usuario_create);

module.exports = router;