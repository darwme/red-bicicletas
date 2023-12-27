var Usuario = require('../../models/usuario');

exports.usuario_list = async function (req, res) {
    try {
        const usuarios = await Usuario.find({});
        console.log("USUARIOS", usuarios);
        res.status(200).json({
            usuarios: usuarios
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.usuario_create = async function (req, res) {
    try {
        var usuario = Usuario.createInstance(
            req.body.nombre
        );

        const newUsuario = await Usuario.add(usuario);
        console.log("USUARIO AGREGADO y PASADO COMO RES", newUsuario);
        res.status(200).json({
            usuario: newUsuario
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

