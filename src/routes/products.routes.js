// .routes.js lo unico que hace es que cambia el icono a un icono de rutas
import { Router } from 'express';
import { ProductManager } from '../controllers/ProductManager.js';
import productModel from '../models/products.models.js';

const routerProd = Router();
const productManager = new ProductManager('./src/models/products.json');

// implementación con JSON

// routerProd.get('/', async (req, res) => {
// 	const { limit } = req.query;

// 	const prods = await productManager.getProducts();
// 	const productos = prods.slice(0, limit);

// 	res.status(200).send(productos);
// });

// routerProd.get('/:pid', async (req, res) => {
// 	const { pid } = req.params;
// 	const prod = await productManager.getProductById(parseInt(pid));

// 	prod ? res.status(200).send(prod) : res.status(404).send('Producto no existente');
// });

// routerProd.post('/', async (req, res) => {
// 	const confirmacion = await productManager.addProduct(req.body);
// 	confirmacion
// 		? res.status(200).send('Producto creado correctamente')
// 		: res.status(400).send('Producto ya existente');
// });

// routerProd.put('/:pid', async (req, res) => {
// 	const { pid } = req.params;
// 	const confirmacion = await productManager.updateProducts(parseInt(pid), req.body);
// 	confirmacion
// 		? res.status(200).send('Producto actualizado correctamente')
// 		: res.status(400).send('Producto ya existente');
// });

// routerProd.delete('/:pid', async (req, res) => {
// 	const { pid } = req.params;
// 	const confirmacion = await productManager.deleteProduct(parseInt(pid));
// 	confirmacion
// 		? res.status(200).send('Producto eliminado correctamente')
// 		: res.status(404).send('Producto no encontrado');
// });

// implementación con MONGO DB

routerProd.get('/', async (req, res) => {
	const { limit } = req.query;
	try {
		const prods = await productModel.find().limit(limit);
		res.status(200).send({ resultado: 'OK', message: prods });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar productos: ${error}` });
	}
});

routerProd.get('/:pid', async (req, res) => {
	const { pid } = req.params;
	try {
		const prod = await productModel.findById(pid);
		prod
			? res.status(200).send({ resultado: 'OK', message: prod })
			: res.status(404).send({ resultado: 'Not Found', message: prod });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar producto: ${error}` });
	}
});

routerProd.post('/', async (req, res) => {
	const { title, description, stock, code, price, category } = req.body;

	try {
		const respuesta = await productModel.create({
			title,
			description,
			category,
			stock,
			code,
			price,
		});
		res.status(200).send({ resultado: 'OK', message: respuesta });
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
});

routerProd.put('/:pid', async (req, res) => {
	const { pid } = req.params;
	const { title, description, stock, code, price, category, status } = req.body;
	try {
		const prod = await productModel.findByIdAndUpdate(pid, {
			title,
			description,
			category,
			stock,
			code,
			price,
		});
		prod
			? res.status(200).send({ resultado: 'OK', message: prod })
			: res.status(404).send({ resultado: 'Not Found', message: prod });
	} catch (error) {
		res.status(400).send({ error: `Error al actualizar producto: ${error}` });
	}
});

routerProd.delete('/:pid', async (req, res) => {
	const { pid } = req.params;
	try {
		const prod = await productModel.findByIdAndDelete(pid);
		prod
			? res.status(200).send({ resultado: 'OK', message: prod })
			: res.status(404).send({ resultado: 'Not Found', message: prod });
	} catch (error) {
		res.status(400).send({ error: `Error al eliminar producto: ${error}` });
	}
});

export default routerProd;
