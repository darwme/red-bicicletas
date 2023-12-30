const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

let nodemailerMailgun;
// Configuración de nodemailer para utilizar el transporte de Mailgun

if (process.env.NODE_ENV === 'production') {
    console.log('entro a produccion o staging');
    console.log('MAILGUN_API_KEY', process.env.MAILGUN_API_KEY);
    console.log('MAILGUN_DOMAIN', process.env.MAILGUN_DOMAIN);
    var auth = {
        auth: {
            api_key: '9af306040a4c11e2f540a93ae6995175-1900dca6-d3ed18c6',
            domain: 'https://red-bicicletas-production.up.railway.app/',
        }
    };

    nodemailerMailgun = nodemailer.createTransport(mg(auth));
} else {
    console.log('entro a desarrollo');
    console.log('MAILER_USER', process.env.MAILER_USER);
    console.log('MAILER_CONTRASENA', process.env.MAILER_CONTRASENA);
    nodemailerMailgun = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_CONTRASENA,
        }
    });
}
    


module.exports = { nodemailerMailgun };

