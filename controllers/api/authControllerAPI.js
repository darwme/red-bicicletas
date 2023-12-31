const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/usuario');
const { authenticate } = require('passport');

module.exports = {
    authenticate: async function (req, res, next) {
        try {
            const userInfo = await Usuario.findOne({ 
                email: req.body.email 
            });
            if (userInfo === null) {
                return res.status(401).json({ 
                    status: 'error', 
                    message: 'Invalido email/password', 
                    data: null });
            }
            if (userInfo != null && bcrypt.compareSync(
                req.body.password,
                userInfo.password
            )) {
                const token = jwt.sign({
                    id: userInfo._id
                },
                    req.app.get('secretKey'),
                    {
                        expiresIn: '7d'
                    });
                res.status(200).json({
                    message: 'Usuario encontrado',
                    data: {
                        usuario: userInfo,
                        token: token
                    }
                });
            } else {
                res.status(401).json({
                    status: 'error',
                    message: 'Invalido email/password',
                    data: null
                });
            }
        } catch (err) {
            next(err);
        }
    },

    forgotPassword: async function (req, res, next) {
        try {
            const usuario = await Usuario.findOne({
                email: req.body.email
            });
            if (!usuario) return res.status(401).json({
                message: 'No existe el usuario',
                data: null
            });
            usuario.resetPassword(function (err) {
                if (err) return next(err);
                res.status(200).json({
                    message: 'Se envió un email para resetear el password',
                    data: null
                });
            });
        } catch (err) {
            next(err);
        }
    },

    authFacebookToken: async function (req, res, next) {
        try {
            if (req.user) {
                await req.user.save();
                const token = jwt.sign({
                    id: req.user.id
                }, req.app.get('secretKey'), {
                    expiresIn: '7d'
                });
                res.status(200).json({
                    message: 'Usuario encontrado o creado',
                    data: {
                        usuario: req.user,
                        token: token
                    }
                });
            } else {
                res.status(401);
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        }
    },

}