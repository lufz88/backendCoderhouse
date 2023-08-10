import express from 'express';
import { engine } from 'express-handlebars';
//revisar lo de multer
import routerProd from './routes/products.routes.js';
import { __dirname } from './path.js';
import path from 'path';
const app = express();

const PORT = 8080;

//Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', engine()); //defino que mi motor de plantillas va a ser handlebars
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

// Routes
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use('/api/products', routerProd); // defino que mi app va a usar lo que venga en routerProd para la ruta que defina

// HBS
app.get('/static', (req, res) => {
	// indicar que plantilla voy a utilizar
	const user = {
		nombre: 'Lucía',
		cargo: 'Tutor',
	};
	res.render('home', {
		usuario: user,
		isTutor: user.cargo == 'Tutor', // Tengo que consultarlo antes, en el js porque handlebars no puede manejar operadores logicos
	});
});

// Server
app.listen(PORT, () => {
	console.log(`Servidor desde puerto: ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});
