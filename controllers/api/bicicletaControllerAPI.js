var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = async function(req, res) {
    try {
        const bicicletas = await Bicicleta.find({});
        console.log("BICICLETAS", bicicletas);
        res.status(200).json({
            bicicletas: bicicletas
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.bicicleta_create = async function (req, res) {
    try {
        var bici = Bicicleta.createInstance(
            req.body.code,
            req.body.color,
            req.body.modelo,
            [req.body.lat, req.body.lng]
        );

        const newBici = await Bicicleta.add(bici);
        console.log("BICICLETA AGREGADO y PASADO COMO RES", newBici);
        res.status(200).json({
            bicicleta: newBici
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.bicicleta_delete = async function (req, res) {
    try {
        var code = req.body.code;

        const result = await Bicicleta.removeByCode(code);

        if (result.deletedCount === 0) {
            res.status(404).json({ error: 'Bicicleta not found' });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bicicleta_update = async function (req, res) {
    try {
        var code = req.body.code;

        const updatedBici = await Bicicleta.updateByCode(code, req.body);

        if (!updatedBici) {
            res.status(404).json({ error: 'Bicicleta not found' });
        } else {
            res.status(200).json({
                bicicleta: updatedBici
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


