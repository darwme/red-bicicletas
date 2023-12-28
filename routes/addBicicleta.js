const express = require('express');
const router = express.Router();
const bicicletaController = require('../controllers/addBicicleta');

router.get('/agregarBicicletas', (req, res) => {
    bicicletaController.agregarBicicletas();
    res.send('Bicicletas agregadas correctamente.');
});

module.exports = router;
