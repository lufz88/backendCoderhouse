import local from 'passport-local'; // Estrategia
import passport from 'passport'; // Manejador de las estrategias
import GithubStrategy from 'passport-github2';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import userModel from '../models/users.models.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
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
			{
				passReqToCallback: true,
				usernameField: 'email',
			},
			async (req, username, password, done) => {
				const { first_name, last_name, email, age } = req.body;

				try {
					const user = await userModel.findOne({ email: username });
					if (user) {
						return done(null, user);
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
						done(null, false);
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
