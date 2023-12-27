var Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = function(req, res, next){
    res.render('bicicletas/index', { title: 'Bicicletas', bicis: Bicicleta.allBicis });
}