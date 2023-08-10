import express from 'express';
import routerProd from './routes/products.routes.js';
const app = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', routerProd); // defino que mi app va a usar lo que venga en routerProd para la ruta que defina

app.listen(PORT, () => {
	console.log(`Servidor desde puerto: ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});
