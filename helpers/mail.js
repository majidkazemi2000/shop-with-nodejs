const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '8a138bb109feab', // generated ethereal user
        pass: '4b7967490dc293' // generated ethereal password
    }
});

module.exports = transporter;