var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

var base_url = 'http://localhost:3000/api/bicicletas';


describe('Bicicleta API', () => {
    beforeAll(async () => {
        // Verifica si ya hay una conexión activa antes de intentar conectar
        if (mongoose.connection.readyState === 0) {
            var mongoDB = 'mongodb://localhost/testdb';
            await mongoose.connect(mongoDB);
        }
    });

    afterAll(async () => {
        await Bicicleta.deleteMany({});
        // Cierra la conexión solo si la abriste en las pruebas
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });

    afterEach(async () => {
        await Bicicleta.deleteMany({});
        console.log('Bicicletas deleted');
    });


    describe('GET BICICLETAS /', () => {
        it('Status 200', (done) => {
            request.get(base_url, function (error, response, body) {
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(0);
                done();
            });
        });
    });

    describe('POST BICICLETAS /create', () => {
        it('Status 200', (done) => {
            var headers = { 'content-type': 'application/json' };
            var aBici = '{"code": 10, "color": "rojo", "modelo": "urbana", "lat": -34, "lng": -54}';
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: aBici
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta;
                expect(bici.code).toBe(10);
                expect(bici.ubicacion[0]).toBe(-34);
                expect(bici.ubicacion[1]).toBe(-54);
                done();
            });
        });
    });

    describe('DELETE BICICLETAS /delete', () => {
        it('Status 204', (done) => {
            var headers = { 'content-type': 'application/json' };
            var aBici = '{"code": 10, "color": "rojo", "modelo": "urbana", "lat": -34, "lng": -54}';
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: aBici
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta;
                expect(bici.code).toBe(10);
                request.delete({
                    headers: headers,
                    url: base_url + '/delete',
                    body: aBici
                }, function (error, response, body) {
                    expect(response.statusCode).toBe(204);
                    done();
                });
            });
        });
    });

    describe('PATCH BICICLETAS /update', () => {
        it('Status 200', (done) => {
            var headers = { 'content-type': 'application/json' };
            var aBici = '{"code": 11, "color": "rojo", "modelo": "urbana", "lat": -34, "lng": -54}';
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: aBici
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta;
                expect(bici.code).toBe(11);
                bici.color = 'azul';
                request.patch({
                    headers: headers,
                    url: base_url + '/update',
                    body: JSON.stringify(bici)
                }, function (error, response, body) {
                    expect(response.statusCode).toBe(200);
                    var bici = JSON.parse(body).bicicleta;
                    expect(bici.color).toBe('azul');
                    done();
                });
            });
        });
    });


    


    

    
    



   
    
    






});

