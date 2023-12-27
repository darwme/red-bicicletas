var mongoose = require('mongoose');

var Bicicleta = require('../../models/bicicleta');

describe('Testing Bicicletas', function () {
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
            await Bicicleta.deleteMany();
            console.log('Bicicletas deleted');
            await mongoose.disconnect();
        } catch (error) {
            console.log(error);
        }
    });


    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de Bicicleta', () => {
            var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.1);
            console.log(bici);
        });

    });

    describe('Bicicleta.allBicis', () => {
        it('starts empty', async () => {
            try {
                const bicis = await Bicicleta.allBicis();
                expect(bicis.length).toBe(0);
            } catch (err) {
                console.error(JSON.stringify(err));
                fail(err); // Cambiado de done.fail() a fail() para manejar errores
            }
        });
    });

    describe('Bicicleta.add', () => {
        it('agrega solo una bici', async () => {
            try {
                const aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
                await Bicicleta.add(aBici);

                const bicis = await Bicicleta.allBicis();
                expect(bicis.length).toEqual(1);
                expect(bicis[0].code).toEqual(aBici.code);
            } catch (err) {
                console.error(JSON.stringify(err));
                fail(err); // Cambiado de done.fail() a fail() para manejar errores
            }
        });
    });

    describe('Bicicleta.findByCode', () => {
        it('debe devolver la bici con code 1', async () => {
            try {
                const aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
                await Bicicleta.add(aBici);

                const aBici2 = new Bicicleta({ code: 2, color: "rojo", modelo: "urbana" });
                await Bicicleta.add(aBici2);

                const targetBici = await Bicicleta.findByCode(1);
                expect(targetBici.code).toBe(aBici.code);
                expect(targetBici.color).toBe(aBici.color);
                expect(targetBici.modelo).toBe(aBici.modelo);
            } catch (err) {
                console.error(JSON.stringify(err));
                fail(err); // Cambiado de done.fail() a fail() para manejar errores
            }
        });
    });

    describe('Bicicleta.removeByCode', () => {
        it('debe eliminar la bici con code 1', async () => {
            try {
                const aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
                await Bicicleta.add(aBici);

                const aBici2 = new Bicicleta({ code: 2, color: "rojo", modelo: "urbana" });
                await Bicicleta.add(aBici2);

                await Bicicleta.removeByCode(1);

                const targetBici = await Bicicleta.findByCode(1);
                expect(targetBici).toBeNull();
            } catch (err) {
                console.error(JSON.stringify(err));
                fail(err); // Cambiado de done.fail() a fail() para manejar errores
            }
        });
    });

});


/*
describe('Bicicleta.allBicis', () => {
    it('comienza vacia', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe('Bicicleta.add', () => {
    it('agregamos una', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        var a = new Bicicleta(1, 'rojo', 'urbana', [-34.6812454,-58.3864497]);
        Bicicleta.add(a);
        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe('Bicicleta.findById', () => {
    it('debe devolver la bici con id 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        var aBici = new Bicicleta(1, 'rojo', 'urbana', [-34.6866454,-58.3774497]);
        var aBici2 = new Bicicleta(2, 'rojo', 'urbana', [-34.6853454,-58.3834497]);
        Bicicleta.add(aBici);
        Bicicleta.add(aBici2);
        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici.color);
        expect(targetBici.modelo).toBe(aBici.modelo);
        expect(targetBici.ubicacion).toEqual(aBici.ubicacion);
    });
});

describe('Bicicleta.removeById', () => {
    it('debe eliminar la bici con id 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        var aBici = new Bicicleta(1, 'rojo', 'urbana', [-34.6866454,-58.3774497]);
        var aBici2 = new Bicicleta(2, 'rojo', 'urbana', [-34.6853454,-58.3834497]);
        Bicicleta.add(aBici);
        Bicicleta.add(aBici2);
        expect(Bicicleta.allBicis.length).toBe(2);
        Bicicleta.removeById(1);
        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0].id).toBe(2);
    });
});
*/