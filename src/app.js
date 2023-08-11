import express from 'express';
import routerProd from './routes/products.routes.js';
import routerCart from './routes/cart.routes.js';
import { __dirname } from './path.js';
const app = express();

const PORT = 8080;

//Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/static', express.static(`${__dirname}/public`));
app.use('/api/products', routerProd); // defino que mi app va a usar lo que venga en routerProd para la ruta que defina
app.use('/api/carts', routerCart);

// Server
app.listen(PORT, () => {
	console.log(`Servidor desde puerto: ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});
