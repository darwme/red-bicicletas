const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');

let transporter;

if (process.env.NODE_ENV === 'production') {
  transporter = nodemailer.createTransport(mailgunTransport({
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
    },
  }));
} else {
  transporter  = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_CONTRASENA,
    }
}
}

module.exports = transporter;




/*

if (process.env.NODE_ENV === 'production') {
    // Aquí puedes agregar configuración específica para producción
    mailConfig = {
        auth: {
            api_key: process.env.SENDGRID_API_KEY,
        },
        // Otros ajustes específicos de producción...
    };
}else{
    const mailConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_CONTRASENA,
        }
    }
}

module.exports = nodemailer.createTransport(mailConfig);
*/