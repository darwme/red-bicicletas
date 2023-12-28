const nodemailer = require('nodemailer');

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'leo.west@ethereal.email',
        pass: 'XGjK2vckr5nQUVv4ts'
    }
}



module.exports = nodemailer.createTransport(mailConfig);
