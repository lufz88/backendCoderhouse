import 'dotenv/config';
import nodemailer from 'nodemailer';
import { __dirname } from '../path.js';
import { logger } from '../utils/logger.js';

// Config mailing

let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com', // host para gmail;
	port: 465, // puerto de gmail
	secure: true,
	auth: {
		user: 'lucasfrazzettatests@gmail.com',
		pass: process.env.PASSWORD_EMAIL,
		authMethod: 'LOGIN',
	},
});

const sendEmail = async (req, res) => {
	const resultado = await transporter.sendMail({
		from: 'TEST Coder lucasfrazzettatests@gmail.com',
		to: 'lucasfrazzetta@gmail.com',
		subject: 'Buenas tardes',
		html: `
      <div>
        <h1>Hola Buenas Tardes</h1>
      </div>
    `,
		attachments: [
			{
				filename: 'Zabuza.png',
				path: __dirname + '/images/47666.png',
				cid: 'Zabuza.png',
			},
		],
	});
	res.send({ message: `Mail enviado`, response: resultado });
};

const sendPasswordRecoveryEmail = (email, recoveryLink) => {
	const mailOptions = {
		from: 'TEST Coder lucasfrazzettatests@gmail.com',
		to: email,
		subject: 'Restore password link',
		html: `
      <div>
        <h1>Tu link de recuperación</h1>
				<p>${recoveryLink}</p>
      </div>
    `,
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			logger.error(
				`[ERROR][${new Date().tolocaleDateString()} - ${new Date().tolocaleTimeString()}] Ha ocurrido un error: ${
					error.message
				}`
			);
		} else {
			logger.info(
				`[INFO][${new Date().tolocaleDateString()} - ${new Date().tolocaleTimeString()}] Email enviado correctamente`
			);
		}
	});
};

const mailingController = { sendEmail, sendPasswordRecoveryEmail };

export default mailingController;
