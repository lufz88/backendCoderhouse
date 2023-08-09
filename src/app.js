import express from 'express';
import routerProd from './routes/products.routes';

const app = express();

const PORT = 8080;

app.use('/api/products', routerProd); // defino que mi app va a usar lo que venga en routerProd para la ruta que defina
