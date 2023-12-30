const Nodemailer = require("nodemailer");
const MailtrapTransport = require("mailtrap");



const MAILTRAP_API_KEY = process.env.MAILTRAP_API_KEY || "";

let mailConfig;

if (MAILTRAP_API_KEY && process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    const options = {
        auth: {
            api_key: MAILTRAP_API_KEY,
        },
    };
    mailConfig = Nodemailer.createTransport(MailtrapTransport({ options }));
} else {
    mailConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'leo.west@ethereal.email',
            pass: 'XGjK2vckr5nQUVv4ts',
        }
    };
}


module.exports = Nodemailer.createTransport(mailConfig);
