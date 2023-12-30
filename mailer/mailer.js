const nodemailer = require('nodemailer');
const mailTrapTransport = require('mailtrap');

let mailConfig;
if (process.env.NODE_ENV === 'production') {
    const options = {
        auth: {
            api_key: process.env.MAILTRAP_API_KEY,
        }
    }
    mailConfig = mailTrapTransport(options);
} else {
    if (process.env.NODE_ENV === 'staging') {
        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
        const options = {
            auth: {
                api_key: process.env.MAILTRAP_API_KEY,
            }
        }
        mailConfig = mailTrapTransport(options);

    } else {
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'leo.west@ethereal.email',
                pass: 'XGjK2vckr5nQUVv4ts'
            }
        }
    }
}

    module.exports = nodemailer.createTransport(mailConfig);
