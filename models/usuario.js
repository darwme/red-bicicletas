var mongoose = require('mongoose'); // Add this line to import the mongoose package
var Reserva = require('./reserva'); // Add this line to import the Reserva model
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const saltRound = 10;
const { nodemailerMailgun } = require('../mailer/mailer');
const Token = require('./token');


const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
    return re.test(email);
}

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'El email ingresado no es válido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/]

    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, {
    message: 'El {PATH} ya existe con otro usuario'
});



usuarioSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, saltRound);
    }
});


// Convertir la función validPassword en una función que devuelve una promesa
usuarioSchema.methods.validPassword = async function (password) {
    try {
        const isPasswordValid = await bcrypt.compare(password, this.password);
        return isPasswordValid;
    } catch (err) {
        throw err;
    }
}



usuarioSchema.statics.createInstance = function (nombre) {
    return new this({
        nombre: nombre
    });
}

usuarioSchema.methods.toString = function () {
    return this.nombre;
}

usuarioSchema.statics.allUsuarios = function () {
    return this.find({});
}


usuarioSchema.statics.add = async function (usuario) {
    return await this.create(usuario);
}

usuarioSchema.methods.enviar_email_bienvenida = async function () {
    const token = new Token({
        _userId: this.id,
        token: crypto.randomBytes(16).toString('hex')
    });
    const email_destination = this.email;
    try {
        await token.save();
        const mailOptions = {
            from: 'darwin_estuvo_aqui@nasa.com',
            to: email_destination,
            subject: 'Verificación de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '\n'
        };
        await nodemailerMailgun.sendMail(mailOptions);
        console.log('Se ha enviado un email de bienvenida a: ' + email_destination + '.');
    } catch (err) {
        console.log(err.message);
    }
}


usuarioSchema.methods.resetPassword = async function () {
    const token = new Token({
        _userId: this.id,
        token: crypto.randomBytes(16).toString('hex')
    });
    const email_destination = this.email;
    try {

        await token.save();
        const mailOptions = {
            from: 'darwin_estuvo_aqui@nasa.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para resetear el password de su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/resetPassword\/' + token.token + '\n'
        };
        await nodemailerMailgun.sendMail(mailOptions);
        console.log('Se envió un email para resetear el password a: ' + email_destination + '.');

    } catch (err) {
        console.log(err.message);
    }
}


usuarioSchema.statics.findOneOrCreateByGoogle = async function findOneOrCreate(condition) {
    const self = this;
    console.log('condition', condition);
    try {
        const result = await self.findOne({
            $or: [
                { 'googleId': condition.id }, { 'email': condition.emails[0].value }
            ]
        });
        if (result) {
            return result;
        } else {
            console.log('--------- CONDITION ---------', condition);
            let values = {};
            values.googleId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName;
            values.verificado = true;
            values.password = condition._json.etag;
            //values.password = crypto.randomBytes(16).toString('hex');
            
            console.log('--------- VALUES ---------', values);
            const createdResult = await self.create(values);
            return createdResult;
        }
    } catch (err) {
        console.log('::::::::ERROR:::::::\n', err);
        throw err;
    }
};

module.exports = mongoose.model('Usuario', usuarioSchema);