import { Router } from 'express';
import { CartManager } from '../controllers/CartManager.js';
import cartModel from '../models/products.models.js';

const routerCart = Router();
const cartManager = new CartManager('./src/models/carts.json', './src/models/products.json');

// implementación al JSON

routerCart.get('/:cid', async (req, res) => {
	const { cid } = req.params;
	const products = await cartManager.getProductsFromCart(parseInt(cid));
	products ? res.status(200).send(products) : res.status(404).send('Carrito no existente');
});

routerCart.post('/', async (req, res) => {
	await cartManager.createCart();
	res.status(200).send('Carrito creado correctamente');
});

routerCart.post('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params;
	const confirmacion = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
	confirmacion
		? res.status(200).send('Producto agregado correctamente')
		: res.status(404).send('Carrito o producto inexistente');
});

// implementación con MONGODB

routerCart.get('/', async (req, res) => {
	const { limit } = req.query;
	try {
		const carts = await cartModel.find().limit(limit);
		res.status(200).send({ resultado: OK, message: carts });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carritos: ${error}` });
	}
});

routerCart.get('/:cid', async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findById(cid);
		cart
			? res.status(200).send({ resultado: OK, message: cart })
			: res.status(404).send({ resultado: 'Not Found', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carrito: ${error}` });
	}
});

routerCart.post('/', async (req, res) => {
	const { id_prod, quantity } = req.body;

	try {
		const respuesta = await cartModel.create({
			id_prod,
			quantity,
		});
		res.status(200).send({ resultado: 'OK', message: respuesta });
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
});

routerCart.update('/:cid', async (req, res) => {
	const { cid } = req.params;
	const { id_prod, quantity } = req.body;

	try {
		const prod = await cartModel.findByIdAndUpdate(cid, {
			id_prod,
			quantity,
		});
		cart
			? res.status(200).send({ resultado: OK, message: cart })
			: res.status(404).send({ resultado: 'Not Found', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
});

routerCart.delete('/:cid', async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findByIdAndDelete(cid);
		cart
			? res.status(200).send({ resultado: OK, message: cart })
			: res.status(404).send({ resultado: 'Not Found', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al eliminar carrito: ${error}` });
	}
});

export default routerCart;
