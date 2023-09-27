import local from 'passport-local'; // Estrategia
import passport from 'passport'; // Manejador de las estrategias
import GithubStrategy from 'passport-github2';
import jwt, { ExtractJwt } from 'passport-jwt';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import userModel from '../models/users.models.js';

// Defino la estrategia a utilizar
const LocalStrategy = local.Strategy;

const initializePassport = () => {
	const cookieExtractor = req => {
		console.log(req.cookies);
		// {} no hay cookies != no existe mi cookie
		// si existen cookies, consulto por mi cookie y si no le asigno {}}
		const token = req.cookies ? req.cookies.jwtCookie : {};
		console.log(token);
		return token;
	};

	passport.use(
		'jwt',
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // consulto el token de las cookies
				secretOrKey: process.env.JWT_SECRET,
			},
			async (jwt_payload, done) => {
				try {
					return done(error, jwt_payload);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	localRegister();
	githubRegister();
	initializeSession();
	removeSession();
	localLogin();
};

const localRegister = () => {
	passport.use(
		'register',
		new LocalStrategy(
			// done es como si fuera un res.status() - es el callback de respuesta
			{
				passReqToCallback: true,
				usernameField: 'email',
			},
			async (req, username, password, done) => {
				//defino como voy a registrar un usuario
				const { first_name, last_name, email, age } = req.body;

				try {
					const user = await userModel.findOne({ email: username });
					if (user) {
						return done(null, false);
						// done es como un return, finaliza la acción. argumentos: hubo erorr? - hay usuario?
					}
					const passwordHash = createHash(password);
					const userCreated = await userModel.create({
						first_name: first_name,
						last_name: last_name,
						email: email,
						age: age,
						password: passwordHash,
					});
					return done(null, userCreated);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
};
const localLogin = () => {
	passport.use(
		'login',
		new LocalStrategy(
			{
				usernameField: 'email',
			},
			async (username, password, done) => {
				try {
					const user = await userModel.findOne({ email: username });
					if (!user) {
						return done(null, false);
					}
					if (validatePassword(password, user.password)) {
						return done(null, user); // usuario y contraseña validos
					}

					return done(null, false); // contrase{a invalida}
				} catch (error) {
					return done(error);
				}
			}
		)
	);
};

const githubRegister = () => {
	passport.use(
		'github',
		new GithubStrategy(
			{
				clientID: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				callbackURL: process.env.CALLBACK_URL,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const user = await userModel.findOne({ email: profile._json.email });
					if (user) {
						done(null, false);
					} else {
						const userCreated = await userModel.create({
							first_name: profile._json.name,
							last_name: ' ', // vació porque en github no hay last_name
							email: profile._json.email,
							age: 18, // edad por defecto
							password: 'password', // generar contraseña sencilla y que se la cambie cuando ingresa
						});
						done(null, userCreated);
					}
				} catch (error) {
					done(error);
				}
			}
		)
	);
};

const removeSession = () => {
	//Eliminar la sesion del usuario

	passport.deserializeUser(async (id, done) => {
		const user = await userModel.findById(id);
		done(null, user);
	});
};

const initializeSession = () => {
	// iniciar la sesión del usuario

	passport.serializeUser((user, done) => {
		done(null, user._id); // error, id para la sesión
	});
};

export default initializePassport;
