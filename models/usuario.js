var mongoose = require('mongoose'); // Add this line to import the mongoose package
var Bicicleta = require('./bicicleta');
var Reserva = require('./reserva'); // Add this line to import the Reserva model
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre: String
});

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


usuarioSchema.statics.add = async function(usuario) {
    return await this.create(usuario);
}



module.exports = mongoose.model('Usuario', usuarioSchema);