import nodemailer, { Transporter } from 'nodemailer';
import config from './index';

const transporter: Transporter = nodemailer.createTransport({
    host: config.mail_host,
    port: config.mail_port,
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

export default transporter;
