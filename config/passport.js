const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async function (email, password, done) {
        try {
            const usuario = await Usuario.findOne({ email: email });
            if (!usuario) {
                return done(null, false, { message: 'Email incorrecto.' });
            }
            const valor = await usuario.validPassword(password);
            if (!valor) {
                console.log('password incorrecto', valor);
                return done(null, false, { message: 'Password incorrecto.' });
            }
            console.log('usuario', valor);
            return done(null, usuario);
        } catch (err) {
            console.log('error en passport', err);
            return done(null, false, { message: 'existe error', err });
        }
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
    try {
        const usuario = await Usuario.findById(id);
        cb(null, usuario);
    } catch (err) {
        cb(err);
    }
});
module.exports = passport;

