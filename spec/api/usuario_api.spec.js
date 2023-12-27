var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');
var request = require('request');
var server = require('../../bin/www');

var base_url = 'http://localhost:3000/api/usuarios';

describe('Testing Usuarios API', () => {
    beforeAll(async () => {
        // Verifica si ya hay una conexión activa antes de intentar conectar
        if (mongoose.connection.readyState === 0) {
            var mongoDB = 'mongodb://localhost/testdb';
            await mongoose.connect(mongoDB);
        }
    });

    afterAll(async () => {
        
        await Usuario.deleteMany({});
        
        // Cierra la conexión solo si la abriste en las pruebas
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });

    afterEach(async () => {
        
        await Usuario.deleteMany({});

        console.log('Reservas, Usuarios y Bicicletas deleted');
    });

    describe('GET USUARIOS /', () => {
        it('Status 200', (done) => {
            request.get(base_url, function (error, response, body) {
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.usuarios.length).toBe(0);
                done();
            });
        });
    });

    describe('POST USUARIOS /create', () => {
        it('Status 200', (done) => {
            var headers = { 'content-type': 'application/json' };
            var aUsuario = '{"nombre": "Test"}';
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: aUsuario
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                var usuario = JSON.parse(body).usuario;
                expect(usuario.nombre).toBe('Test');
                done();
            });
        });
    });

  


});