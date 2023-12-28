const Token = require('../models/token');
const Usuario = require('../models/usuario'); // Import the Usuario model

module.exports = {
    confirmationGet: async function (req, res, next) {
        try {
            const foundToken = await Token.findOne({ token: req.params.token }).exec();
            if (!foundToken) {
                return res.status(400).send({ type: 'not-verified', msg: 'No encontramos un usuario con este token. Tal vez haya expirado.' });
            }

            const usuario = await Usuario.findById(foundToken._userId).exec();
            if (!usuario) {
                return res.status(400).send({ msg: 'No encontramos un usuario con este token.' });
            }
            if (usuario.verificado) {
                return res.redirect('/usuarios');
            }

            usuario.verificado = true;
            await usuario.save();
            res.redirect('/');
        } catch (err) {
            return res.status(500).send({ msg: err.message });
        }
    }
}