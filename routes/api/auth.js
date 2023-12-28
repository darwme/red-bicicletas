const express = require('express');
const router = express.Router();

const authControllerAPI = require('../../controllers/api/authControllerAPI');

router.get('authenticate', authControllerAPI.authenticate);
router.post('forgotPassword', authControllerAPI.forgotPassword);

module.exports = router;