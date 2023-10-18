import { generateToken } from '../utils/jwt.js';

const postSession = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).send({ mensaje: 'Invalidate user' });
		}

		// req.session.user = {
		// 	first_name: req.user.first_name,
		// 	last_name: req.user.last_name,
		// 	age: req.user.age,
		// 	rol: req.user.rol,
		// 	email: req.user.email,
		// };

		const token = generateToken(req.user); // se genera el token con el usuario
		res.cookie('jwtCookie', token, {
			// se envia el token a las cookies
			maxAge: 43200000, // seteamos que dure 12 hs en milisegundos
		});

		return res.redirect('../../static/products');
	} catch (error) {
		res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
	}
};

const getCurrentSession = async (req, res) => {
	res.status(200).send(req.user);
};

const getGithubCreateUser = async (req, res) => {
	return res.status(200).send({ mensaje: 'Usuario creado' });
};

const getGithubSession = async (req, res) => {
	req.session.user = req.user;
	res.status(200).send({ mensaje: 'Sesión creada' });
};

const getLogout = (req, res) => {
	if (req.session) {
		req.session.destroy();
	}
	res.clearCookie('jwtCookie');
	res.status(200).send({ resultado: 'Login eliminado', message: 'Logout' });
};

const sessionController = {
	postSession,
	getCurrentSession,
	getGithubCreateUser,
	getGithubSession,
	getLogout,
};

export default sessionController;
