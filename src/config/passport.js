import 'dotenv/config';
import local from 'passport-local'; // Estrategia
import passport from 'passport'; // Manejador de las estrategias
import GithubStrategy from 'passport-github2';
import jwt, { ExtractJwt } from 'passport-jwt';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import userModel from '../models/users.models.js';
import cartModel from '../models/carts.models.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const initializePassport = () => {
	jwtLogin();
	localRegister();
	localLogin();
	githubRegister();
	initializeSession();
	removeSession();
};

const localRegister = () => {
	passport.use(
		'register',
		new LocalStrategy(
			{
				passReqToCallback: true,
				usernameField: 'email',
			},
			async (req, username, password, done) => {
				const { first_name, last_name, email, age } = req.body;

				try {
					const user = await userModel.findOne({ email: username });
					if (user) {
						return done('Usuario existente');
					}
					const passwordHash = createHash(password);
					const userCreated = await userModel.create({
						first_name: first_name,
						last_name: last_name,
						email: email,
						age: age,
						password: passwordHash,
					});
					req.user = userCreated;
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
						return done(null, user);
					}

					return done(null, false);
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
						done(null, user);
					} else {
						const userCreated = await userModel.create({
							first_name: profile._json.name,
							last_name: ' ',
							email: profile._json.email,
							age: 18,
							password: 'password',
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

const jwtLogin = () => {
	const cookieExtractor = req => {
		const token = req.cookies ? req.cookies.jwtCookie : {};
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
					return done(null, jwt_payload);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
};

const removeSession = () => {
	passport.deserializeUser(async (id, done) => {
		const user = await userModel.findById(id);
		done(null, user);
	});
};

const initializeSession = () => {
	passport.serializeUser((user, done) => {
		done(null, user._id);
	});
};

export default initializePassport;
