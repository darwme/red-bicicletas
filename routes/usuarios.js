const express = require('express');
const router = express.Router();
const usuario = require('../controllers/usuarios');

router.get('/', usuario.u_list);
router.post('/create', usuario.u_create);
router.get('/create', usuario.u_create_get);
router.post('/:id/update', usuario.u_update);
router.get('/:id/update', usuario.u_update_get);
router.delete('/:id/delete', usuario.u_delete);

module.exports = router;
