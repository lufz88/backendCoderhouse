import { Router } from 'express';
import userModel from '../models/users.models.js';
import { createHash } from '../utils/bcrypt.js';
import passport from 'passport';

const routerUser = Router();

routerUser.post('/', passport.authenticate('register'), async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).send({ mensaje: 'Usuario existente' });
		}

		return res.status(200).send({ mensaje: 'Usuario creado' });
	} catch (error) {
		res.status(500).send({ mensaje: `Error al crear el usuario ${error}` });
	}
});

routerUser.get('/', async (req, res) => {
	try {
		const response = await userModel.find();
		res.status(200).send(response);
	} catch (error) {
		res.status(400).send({ error: `Error al consultar usuarios: ${error}` });
	}
});

export default routerUser;

/* 
const { first_name, last_name, email, age, password } = req.body;
	try {
		const hashPassword = createHash(password);
		const response = await userModel.create({
			first_name: first_name,
			last_name: last_name,
			email: email,
			age: age,
			password: hashPassword,
		});
		res.status(200).send({ respuesta: 'Usuario creado', message: response });
	} catch (error) {
		res.status(400).send({ error: `Error al crear usuario: ${error}` });
	}
*/
