import passport from 'passport';

//Función general para retornar errores en las estrategias de passport

//Primer filtro de cualquier estrategia de passport
export const passportError = strategy => {
	return async (req, res, next) => {
		passport.authenticate(strategy, (error, user, info) => {
			if (error) {
				return next(error);
			}

			if (!user) {
				return res
					.status(401)
					.send({ error: info.messages ? info.messages : info.toString() }); // si me envian info.messages, muestro la respuesta que me enviaron. Si no, muestro el objeto info pasado a strign ( hay estrategias que envian el objeto info con la propiedad message)
			}

			req.user = user;
			next();
		})(req, res, next);
	};
};

// Ingreso un rol y verifico si mi usuario lo cumple (ej: ingreso admin y veo si lo es o no)
// Hay rutas propias para los usuarios, rutas propias para los admins, etc
export const authorization = rol => {
	return async (req, res, next) => {
		// Se vuelve a consultar si el usuario existe dado que el token puede expirar, el usuario puede borrar el historial o se rompe la compu ja!
		if (!req.user) {
			return res.status(401).send({ error: 'User no autorizado' });
		}

		if (req.user.user.rol != rol) {
			return res.status(403).send({ error: 'User no tiene los privilegios necesarios' });
		}

		next();
	};
};
