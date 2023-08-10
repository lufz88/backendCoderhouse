// .routes.js lo unico que hace es que cambia el icono a un icono de rutas
import { Router } from 'express';
import { ProductManager } from '../controllers/ProductManager.js';

const routerProd = Router();
const manager = new ProductManager('./src/models/products.json');

routerProd.get('/', async (req, res) => {
	const { limit } = req.query;

	const prods = await manager.getProducts();
	const productos = prods.slice(0, limit);

	res.status(200).send(productos);
});

routerProd.get('/:id', async (req, res) => {
	const { id } = req.params;
	const prod = await manager.getProductById(parseInt(id));

	prod ? res.status(200).send(prod) : res.status(404).send('Producto no existente');
});

routerProd.post('/', async (req, res) => {
	console.log(req.body);
	const confirmacion = await manager.addProduct(req.body);
	confirmacion
		? res.status(200).send('Producto creado correctamente')
		: res.status(400).send('Producto ya existente');
});

routerProd.put('/:id', async (req, res) => {
	const confirmacion = await manager.addProduct(req.params.id, req.body);
	confirmacion
		? res.status(200).send('Producto actualizado correctamente')
		: res.status(400).send('Producto ya existente');
});

routerProd.delete('/:id', async (req, res) => {
	const { id } = req.params;
	const confirmacion = await manager.addProduct(parseInt(id));
	confirmacion
		? res.status(200).send('Producto eliminado correctamente')
		: res.status(404).send('Producto no encontrado');
});

export default routerProd;
