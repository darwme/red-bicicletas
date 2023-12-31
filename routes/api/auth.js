const express = require('express');
const router = express.Router();

const authControllerAPI = require('../../controllers/api/authControllerAPI');
const passport = require('passport');

router.get('authenticate', authControllerAPI.authenticate);
router.post('forgotPassword', authControllerAPI.forgotPassword);
router.post('/facebook_token', passport.authenticate('facebook-token'), authControllerAPI.authFacebookToken);

module.exports = router;