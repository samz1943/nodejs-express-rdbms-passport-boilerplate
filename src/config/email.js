const nodemailer = require('nodemailer');
const config = require('.')

const transporter = nodemailer.createTransport({
    host: config.mail_host,
    port: config.port,
    auth: {
        user: config.mail_username,
        pass: config.mail_password,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error configuring email:', error);
    }
});

module.exports = transporter;
