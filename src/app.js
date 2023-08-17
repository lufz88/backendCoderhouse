import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './path.js';
import path from 'path';

import routerProd from './routes/products.routes.js';
import routerCart from './routes/cart.routes.js';
const app = express();

const PORT = 8080;

// Server
const server = app.listen(PORT, () => {
	console.log(`Servidor desde puerto: ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});

const io = new Server(server);

//Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', engine()); //defino que mi motor de plantillas va a ser handlebars
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

const mensajes = [];

// Conexión con socket.io

io.on('connection', socket => {
	console.log('Conexión con Socket.io');

	socket.on('mensaje', info => {
		console.log(info);
		mensajes.push(info);
		io.emit('mensajes', mensajes);
	});
});

// Routes
app.use('/static', express.static(path.join(__dirname, '/public')));

app.get('/static', (req, res) => {
	// indicar que plantilla voy a utilizar
	// const user = {
	// 	nombre: 'Lucía',
	// 	cargo: 'Tutor',
	// };

	// res.render('home', {
	// 	usuario: user,
	// 	isTutor: user.cargo == 'Tutor', // Tengo que consultarlo antes, en el js porque handlebars no puede manejar operadores logicos
	// });

	res.render('chat', {
		rutaCSS: 'chat',
		rutaJS: 'chat',
	});
});

app.use('/api/products', routerProd); // defino que mi app va a usar lo que venga en routerProd para la ruta que defina
app.use('/api/carts', routerCart);
