import userModel from '../models/users.models.js';
import mailingController from './mail.controller.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';

import crypto from 'crypto';
const postUser = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).send({ mensaje: 'Usuario existente' });
		}
		res.status(200).send({ mensaje: 'Usuario creado' });
	} catch (error) {
		res.status(500).send({ mensaje: `Error al crear el usuario ${error}` });
	}
};

const getUser = async (req, res) => {
	try {
		const response = await userModel.find();
		res.status(200).send(response);
	} catch (error) {
		res.status(400).send({ error: `Error al consultar usuarios: ${error}` });
	}
};

const recoveryLinks = {};

const recoveryPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await userModel.find({ email: email });
		if (user) {
			const token = crypto.randomBytes(20).toString('hex');
			recoveryLinks[token] = { email, timestamp: Date.now() };
			const recoveryLink = `http://localhost:8080/api/users/resetpassword/${token}`;
			mailingController.sendPasswordRecoveryEmail(email, recoveryLink);
			res.status(200).send('Correo enviado correctamente');
		} else {
			res.status(404).send({ error: 'Usuario no encontrado' });
		}
	} catch (error) {
		res.status(500).send({ error: `Error en envío de mail de recuperación ${error}` });
	}
};

const resetPassword = async (req, res) => {
	const { token } = req.params;
	const linkData = recoveryLinks[token];
	const { newPassword } = req.body;
	try {
		if (linkData && Date.now() - linkData.timestamp <= 3600000) {
			const { email } = linkData;
			const user = await userModel.findOne({ email: email });
			console.log(newPassword, user.password);
			const arePasswordsEqual = validatePassword(newPassword, user.password);
			if (!arePasswordsEqual) {
				const passwordHash = createHash(newPassword);
				await userModel.findOneAndUpdate({ email: email }, { password: passwordHash });
			} else {
				res.status(400).send(
					'No es posible cambiar la contraseña porque ya fue utilizada con anterioridad'
				);
			}
			delete recoveryLinks[token];
			res.status(200).send('constraseña modificada correctamente');
		} else {
			res.status(400).send('Token inválido o expirado');
		}
	} catch (error) {
		res.status(500).send({ error: `Error al recuperar contraseña ${error}` });
	}
};

const usersController = { getUser, postUser, recoveryPassword, resetPassword };

export default usersController;
