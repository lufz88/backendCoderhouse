import 'dotenv/config';

import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './path.js';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';

import messageModel from './models/message.models.js';

import routerProd from './routes/products.routes.js';
import routerCart from './routes/carts.routes.js';
import routerMessage from './routes/messages.routes.js';
import routerUser from './routes/users.routes.js';
import routerSession from './routes/sessions.routes.js';
import productModel from './models/products.models.js';
import userModel from './models/users.models.js';
import routerHandlebars from './routes/handlebars.routes.js';

const app = express();

const PORT = 8080;

// Server
const server = app.listen(PORT, () => {
	console.log(`Servidor desde puerto: ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});

const io = new Server(server);

//Middlewares
function auth(req, res, next) {
	if (req.session.emial === 'admin@admin.com') {
		return next();
	} else {
		res.send('No tenés acceso a este contenido');
	}
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE)); // firmo la cookie para que si se modifica la cookie no la acepte / lea
app.use(
	session({
		// configuración de la sesión de mi aplicación
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URL,
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
			ttl: 90, // Time to live - Cuanto va a durar la sesión - Segundos, no milisengundos
		}),
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);
app.engine('handlebars', engine()); //defino que mi motor de plantillas va a ser handlebars
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

// conexión con base de datos

/* no va a ser necesario porque ya se conecta antes cuando se crea la sesión*/

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('DB conectada'))
	.catch(error => console.log(`Error en conexión a MongoDB Atlas:  ${error}`));

// Conexión con socket.io

io.on('connection', socket => {
	console.log('Conexión con Socket.io');

	socket.on('load', async () => {
		const data = await productModel.paginate({}, { limit: 5 });
		socket.emit('products', data);
	});

	socket.on('previousPage', async page => {
		const data = await productModel.paginate({}, { limit: 5, page: page });
		socket.emit('products', data);
	});

	socket.on('nextPage', async page => {
		const data = await productModel.paginate({}, { limit: 5, page: page });
		socket.emit('products', data);
	});

	socket.on('addProduct', async data => {
		const { pid, cartId } = data;
		if (cartId) {
			const cart = await cartModel.findById(cartId);
			const productExists = cart.products.find(prod => prod.id_prod == pid);
			productExists
				? productExists.quantity++
				: cart.products.push({ id_prod: pid, quantity: 1 });
			await cart.save();
			socket.emit('success', cartId);
		} else {
			const cart = await cartModel.create({});
			cart.products.push({ id_prod: pid, quantity: 1 });
			await cart.save();
			socket.emit('success', cart._id.toString());
		}
	});

	socket.on('loadCart', async () => {
		const cart = await cartModel.findById(cartId).populate('products.id_prod');
		if (cart) {
			socket.emit('cartProducts', { products: cart.products, cid: cartId });
		} else {
			socket.emit('cartProducts', false);
		}
	});

	socket.on('newProduct', async product => {
		await productModel.create(product);
		const products = await productModel.find();

		socket.emit('products', products);
	});

	socket.on('mensaje', async info => {
		const { email, message } = info;
		await messageModel.create({
			email,
			message,
		});
		const messages = await messageModel.find();

		socket.emit('mensajes', messages);
	});

	socket.on('submit register', async user => {
		const { email } = user;
		const userExists = await userModel.findOne({ email: email });

		if (!userExists) {
			await userModel.create(user);
			socket.emit('register response', true);
		} else {
			socket.emit('register response', false);
		}
	});

	socket.on('logout', () => {
		console.log(session.login);
		if (session.login) {
			console.log(session);
			session.destroy();
			socket.emit('logoutOk');
		}
	});
});

// Routes
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/static', routerHandlebars);

// Cookies

app.get('/setCookie', (req, res) => {
	//crear / setear la cookie
	// se puede hacer un archivo de tutas
	res.cookie('CookieCookie', 'Esto es el valor de una cookie', { maxAge: 300000 }).send(
		'Cookie creada'
	);
	// nombre de la cookie, valor de la cookie, objeto de opciones
});

app.get('/getCookie', (req, res) => {
	// res.send(req.cookies); // consultar todas las cookies
	res.send(req.signedCookies); // consultar solo las cookies firmadas
});

// // Session

// app.get('/session', (req, res) => {
// 	// si existe la variable counter en la sesion
// 	if (req.session.counter) {
// 		req.session.counter++;
// 		res.send(`Has entrado ${req.session.counter} veces a mi página`);
// 	} else {
// 		// si no existe la creo e indico que es la primera vez que se ingresó
// 		req.session.counter = 1;
// 		res.send('Hola por primera vez');
// 	}
// });

// app.get('/login', (req, res) => {
// 	const { email, password } = req.body;

// 	req.session.email = email;
// 	req.session.password = password;
// 	return res.send('Usuario logueado');
// });

// app.get('/admin', auth, (req, res) => {
// 	// pasa primero por la autenticación, si me autentico, continuo con la ejecución
// 	res.send('Sos admin');
// });

// app.get('/logout', (req, res) => {
// 	// de esta forma salgo de la sesion
// 	req.session.destroy(error => {
// 		error ? console.log(error) : res.send('Salió de la sesión');
// 	});
// });

app.use('/api/products', routerProd); // defino que mi app va a usar lo que venga en routerProd para la ruta que defina
app.use('/api/carts', routerCart);
app.use('/api/messages', routerMessage);
app.use('/api/users', routerUser);
app.use('/api/sessions', routerSession);
