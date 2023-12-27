var mongoose = require('mongoose');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');
var Bicicleta = require('../../models/bicicleta');
var server = require('../../bin/www');

describe('Testing Usuarios', function () {
    beforeEach(function (done) {
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB);

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error: '));
        db.once('open', function () {
            console.log('We are connected to test database!');
            done();
        });
    });


    afterEach(async () => {
        try {
            await Reserva.deleteMany({});
            await Usuario.deleteMany({});
            await Bicicleta.deleteMany({});
            console.log('Reservas, Usuarios y Bicicletas deleted');
            await mongoose.disconnect();
        } catch (error) {
            console.log(error);
        }
    });

    describe('Cuando un usuario reserva una bici', () => {
        it('debe existir la reserva', async () => {
            const usuario = new Usuario({ nombre: 'Juan' });
            await usuario.save();

            const bicicleta = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
            await bicicleta.save();

            var hoy = new Date();
            var mañana = new Date();
            mañana.setDate(hoy.getDate() + 1);

            usuario.reservar(bicicleta.id, hoy, mañana, function (err, reserva) {
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function (err, reservas) {
                    console.log(reservas[0]);

                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                });
            });
        });
    });

    






});