var Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = async function(req, res, next){
    let result = await Bicicleta.allBicis();
    res.render('bicicletas/index', { title: 'Bicicletas', bicis: result });
}