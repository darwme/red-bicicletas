const Usuario = require('../models/usuario');

module.exports = {
    u_list: async function (req, res, next) {
        try {
            const usuarios = await Usuario.find({});
            res.render('usuarios/index', {
                usuarios: usuarios
            });
        } catch (err) {
            console.log('ERROR: ', err);
            res.render('usuarios/index', {
                usuarios: {}
            });
        }
    },

    u_update_get: async function (req, res, next) {
        try {
            const usuario = await Usuario.findById(req.params.id);
            res.render('usuarios/update', {
                errors: {},
                usuario: usuario
            });
        } catch (err) {
            console.log(err);
            res.render('usuarios/update', {
                errors: err.errors,
                usuario: new Usuario({
                    nombre: req.body.nombre,
                    email: req.body.email
                })
            });
        }
    },
    u_update: async function (req, res, next) {
        try {
            const update_values = {
                nombre: req.body.nombre
            };
            await Usuario.findByIdAndUpdate(req.params.id, update_values);
            res.redirect('/usuarios');
        } catch (err) {
            console.log(err);
            res.render('usuarios/update', {
                errors: err.errors,
                usuario: new Usuario({
                    nombre: req.body.nombre,
                    email: req.body.email
                })
            });
        }
    },
    u_create_get: async function (req, res, next) {
        try {
            res.render('usuarios/create', {
                errors: {},
                usuario: new Usuario()
            });
        } catch (err) {
            console.log("ERROR AL CREAR_GET", err);
            res.render('usuarios/create', {
                errors: err.errors,
                usuario: new Usuario()
            });
        }
    },
    u_create: async function (req, res) {
        try {
            if (req.body.password != req.body.confirm_password) {
                res.status(400).render('usuarios/create', {
                    errors: {
                        confirm_password: {
                            message: 'No coincide el password ingresado'
                        }
                    },
                    usuario: new Usuario({
                        nombre: req.body.nombre,
                        email: req.body.email
                    })
                });
                return;
            }
            const nuevoUsuario = await Usuario.create({
                nombre: req.body.nombre,
                email: req.body.email,
                password: req.body.password
            });

            nuevoUsuario.enviar_email_bienvenida();
            console.log('USUARIO CREADO', nuevoUsuario);
            res.redirect('/usuarios');
        } catch (err) {
            console.log('ERROR AL CREAR EL USUARIO', err);
            res.status(500).render('usuarios/create', {
                errors: err.errors,
                usuario: new Usuario({
                    nombre: req.body.nombre,
                    email: req.body.email
                })
            });

        }
    },
    u_delete: function (req, res, next) {
        Usuario.findByIdAndDelete(req.body.id, (err) => {
            if (err) {
                next(err);
            } else {
                res.redirect('/usuarios');
            }
        })
    }
}