// .routes.js lo unico que hace es que cambia el icono a un icono de rutas
import { Router } from 'express';
import productModel from '../models/products.models.js';
import { passportError, authorization } from '../utils/messageErrors.js';

const routerProd = Router();

routerProd.get('/', passportError('jwt'), async (req, res) => {
	const { limit } = req.query;
	try {
		const prods = await productModel.find().limit(limit);
		res.status(200).send({ resultado: 'OK', message: prods });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar productos: ${error}` });
	}
});

routerProd.get('/:pid', passportError('jwt'), async (req, res) => {
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

routerProd.post('/', passportError('jwt'), authorization('admin'), async (req, res) => {
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

routerProd.put('/:pid', passportError('jwt'), authorization('admin'), async (req, res) => {
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

routerProd.delete('/:pid', passportError('jwt'), authorization('admin'), async (req, res) => {
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
