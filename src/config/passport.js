import local from 'passport-local'; // Estrategia
import passport from 'passport'; // Manejador de las estrategias
import { createHash, validatePassword } from '../utils/bcrypt';

// Defino la estrategia a utilizar
const LocalStrategy = local.Strategy;

const initializePassport = () => {
	passport.use(
		'register',
		new LocalStrategy(
			// done es como si fuera un res.status() - es el callback de respuesta
			{
				passReqToCallback: true,
				usernameField: 'email',
			},
			async (req, username, passport, done) => {
				//defino como voy a registrar un usuario
			}
		)
	);
};
