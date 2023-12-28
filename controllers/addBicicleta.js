const Bicicleta = require('../models/bicicleta');



const agregarBicicletas = async () => {
    try {
        const bici1 = new Bicicleta({ codigo: 1, color: 'Rojo', modelo: 'Modelo1', ubicacion: [-34.603722, -58.381592] });
        const bici2 = new Bicicleta({ codigo: 2, color: 'Azul', modelo: 'Modelo2', ubicacion: [-34.607500, -58.377856] });

        const bicicleta1 = await bici1.save();
        console.log('Bicicleta 1 agregada:', bicicleta1);

        const bicicleta2 = await bici2.save();
        console.log('Bicicleta 2 agregada:', bicicleta2);

        const bicicletas = await Bicicleta.allBicis();
        console.log('Bicicletas existentes:', bicicletas);
    } catch (error) {
        console.error('Error al agregar bicicletas:', error);
    }
};

module.exports = {
    agregarBicicletas
};
