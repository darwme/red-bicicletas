var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number],
        index: {type: '2dsphere',
        sparse: true}
    }
});

bicicletaSchema.statics.createInstance = function(code, color, modelo, ubicacion){
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
}

bicicletaSchema.methods.toString = function(){
    return 'code: ' + this.code + " | color:  " + this.color;
}

bicicletaSchema.statics.add = async function(aBici) {
    return await this.create(aBici);
}

bicicletaSchema.statics.allBicis = function(){
    return this.find({});
}

bicicletaSchema.statics.findByCode = function(aCode){
    return this.findOne({code: aCode});
}

bicicletaSchema.statics.removeByCode = function(aCode){
    return this.deleteOne({code: aCode});
}

bicicletaSchema.statics.updateByCode = async function (aCode, newData) {
    return await this.findOneAndUpdate({ code: aCode }, newData, { new: true });
}


module.exports = mongoose.model('Bicicleta', bicicletaSchema);


/*
var Bicicleta = function (id, color, modelo, ubicacion){
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function(){
    return 'id: ' + this.id + " | color:  " + this.color;
}

Bicicleta.allBicis = [];
Bicicleta.add = function(aBici){
    Bicicleta.allBicis.push(aBici);
}

Bicicleta.findById = function(aBiciId){
    var aBici = Bicicleta.allBicis.find(x => x.id == aBiciId);
    if(aBici)
        return aBici;
    else
        throw new Error(`No existe una bicicleta con el id ${aBiciId}`);
};

Bicicleta.removeById = function(aBiciId){
    for(var i = 0; i < Bicicleta.allBicis.length; i++){
        if(Bicicleta.allBicis[i].id == aBiciId){
            Bicicleta.allBicis.splice(i, 1);
            break;
        }
    }
};

var a = new Bicicleta(1, 'rojo', 'urbana', [-34.6812424,-58.3861497]);
var b = new Bicicleta(2, 'blanca', 'urbana', [-34.596932,-58.2888287]);

Bicicleta.add(a);
Bicicleta.add(b);

module.exports = Bicicleta;
*/