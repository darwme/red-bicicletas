const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');


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

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'no se encontro',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + '/auth/google/callback'
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            console.log('profile', profile);
            const user = await Usuario.findOneOrCreateByGoogle(profile);
            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
));


passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID || 'no se encontro',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
}, async function (accessToken, refreshToken, profile, done) {
    try {
        console.log('profile', profile);
        const user = await Usuario.findOneOrCreateByFacebook(profile);
        return done(null, user);
    } catch (err) {
        return done(err);
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

