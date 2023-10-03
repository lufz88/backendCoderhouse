import { Router } from 'express';
import passport from 'passport';
import { passportError, authorization } from '../utils/messageErrors';
import { generateToken } from '../utils/jwt';

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
		const token = generateToken(req.user); // se genera el token con el usuario
		res.cookie('jwtCookie', token, {
			// se envia el token a las cookies
			maxAge: 43200000, // seteamos que dure 12 hs en milisegundos
		});
		res.status(200).send({ payload: req.user });
	} catch (error) {
		res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
	}
});

// a esta ruta solo podrán acceder admins
routerSession.get('/current', passportError('jwt'), (req, res) => {
	res.send(req.user);
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
	if (req.session) {
		// eliminar la sesion
		req.session.destroy();
	}
	res.clearCookie('jwtCookie'); // eliminamos el token de la cookie
	res.status(200).send({ resultado: 'Login eliminado', message: 'Logout' });
});

export default routerSession;
