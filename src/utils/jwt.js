import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const generateToken = user => {
	/* 
    1° parámetro: Objeto asociado del token
    2° parámetro: Clave privada para el cifrado de los datos
    3° patámetro: Tiempo de vida
  */
	const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '12h' });
	return token;
};

export const authToken = (req, res, next) => {
	// Consulto el header

	const authHeader = req.cookies.jwtCookie; // Consulto si existe el token

	if (!authHeader) {
		return res.status(401).send({ error: 'Usuario no autenticado' });
	}

	const token = authHeader.split(' ')[1]; // Separo en dos el token y me quedo con el token en sí
	jwt.sign(token, process.env.JWT_SECRET, (error, credentials) => {
		if (error) {
			return res.status(403).send({ error: 'Usuario no autorizado' });
		}
		//descifro el token
		req.user = credentials.user;

		next();
	});
};
