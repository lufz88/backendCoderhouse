import { Router } from 'express';
import userModel from '../models/users.models.js';
import { validatePassword } from '../utils/bcrypt.js';
import passport from 'passport';

const routerSession = Router();

routerSession.post('/login', passport.authenticate('login'), async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).send({ mensaje: 'Invalidate user' });
		}

		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			age: req.user.age,
			email: req.user.email,
		};

		res.status(200).send({ payload: req.user });
	} catch (error) {
		res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
	}
});

routerSession.get(
	'/github',
	passport.authenticate('github', { scope: ['user: email'] }),
	async (req, res) => {
		return res.status(200).send({ mensaje: 'Usuario creado' });
	}
);

routerSession.get('/githubSession', passport.authenticate('github'), async (req, res) => {
	req.session.user = req.user;
	res.status(200).send({ mensaje: 'Sesión creada' });
});

routerSession.get('/logout', (req, res) => {
	if (req.session.login) {
		// eliminar la sesion
		req.session.destroy();
	}

	res.status(200).send({ resultado: 'Login eliminado', message: 'Logout' });
});

export default routerSession;

/* 
const { email, password } = req.body;

	try {
		if (req.session.login) {
			// si ya hay una sesion activa, que se loguee
			res.status(200).send({ resultado: 'Login ya existente', message: email });
			return;
		}

		const user = await userModel.findOne({ email: email });
		if (user) {
			if (validatePassword(password, user.password)) {
				req.session.login = true;
				res.status(200).send({ resultado: 'Login válido', message: user });
			} else {
			}
		} else {
			res.status(404).send({ resultado: 'Not Found', message: user });
		}
	} catch (error) {
		res.status(400).send({ error: `Error en login ${error}` });
	}
*/
