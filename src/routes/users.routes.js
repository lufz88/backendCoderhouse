import { Router } from 'express';
import userModel from '../models/users.models.js';
const routerUser = Router();

routerUser.post('/', async (req, res) => {
	const { first_name, last_name, email, age, password } = req.body;
	try {
		const response = await userModel.create({
			first_name,
			last_name,
			email,
			age,
			password,
		});
		res.status(200).send({ respuesta: 'Usuario creado', message: response });
	} catch (error) {
		res.status(400).send({ error: `Error al crear usuario: ${error}` });
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
