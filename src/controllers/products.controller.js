import productModel from '../models/products.models.js';
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import { generateProductErrorInfo } from '../services/errors/info.js';
const getProducts = async (req, res) => {
	const { limit, page, sort, category } = req.query;

	const pag = page ? page : 1;
	const lim = limit ? limit : 10;
	const ord = sort === 'asc' ? 1 : 0;
	const filter = category ? { category: category } : {};

	try {
		const products = await productModel.paginate(filter, {
			limit: lim,
			page: pag,
			sort: { price: ord },
		});

		if (products) {
			return res.status(200).send(products);
		}

		res.status(404).send({ error: 'Productos no encontrados' });
	} catch (error) {
		res.status(500).send({ error: `Error en consultar productos ${error}` });
	}
};

const getProduct = async (req, res) => {
	const { pid } = req.params;

	try {
		const product = await productModel.findById(pid);

		if (product) {
			return res.status(200).send(product);
		}

		res.status(404).send({ error: 'Producto no encontrado' });
	} catch (error) {
		res.status(500).send({ error: `Error en consultar producto ${error}` });
	}
};

const postProduct = async (req, res) => {
	const { title, description, code, price, stock, category } = req.body;

	if ((!title, !description, !code, !price, !stock, !category)) {
		CustomError.createError({
			name: 'Error de creación de producto',
			cause: generateProductErrorInfo({ title, description, code, price, stock, category }),
			message: 'Error al crear producto',
			code: EErrors.MISSING_OR_INVALID_PRODUCT_DATA,
		});
	}

	try {
		const product = await productModel.create({
			title,
			description,
			code,
			price,
			stock,
			category,
		});

		if (product) {
			return res.status(201).send({ mensaje: 'Producto creado', product: product });
		}
	} catch (error) {
		if (error.code == 11000) {
			res.status(400).send({ error: `Llave duplicada` });
		}

		return res.status(500).send({ error: `Error en consultar producto ${error}` });
	}
};

const putProduct = async (req, res) => {
	const { pid } = req.params;
	const { title, description, code, price, stock, category } = req.body;

	if ((!title, !description, !code, !price, !stock, !category)) {
		CustomError.createError({
			name: 'Error de actualización de producto',
			cause: generateProductErrorInfo({
				title,
				description,
				code,
				price,
				stock,
				category,
			}),
			message: 'Error al actualizar producto',
			code: EErrors.MISSING_OR_INVALID_PRODUCT_DATA,
		});
	}

	try {
		const product = await productModel.findByIdAndUpdate(pid, {
			title,
			description,
			code,
			price,
			stock,
			category,
		});

		if (product) {
			return res.status(200).send({ mensaje: 'Producto actualizado', product: product });
		}

		res.status(404).send({ error: 'Producto no encontrado' });
	} catch (error) {
		res.status(500).send({ error: `Error en actualizar producto ${error}` });
	}
};

const deleteProduct = async (req, res) => {
	const { pid } = req.params;

	try {
		const product = await productModel.findByIdAndDelete(pid);
		if (product) {
			return res.status(201).send({ mensaje: 'Producto eliminado', product: product });
		}

		res.status(404).send({ error: 'Producto no encontrado' });
	} catch (error) {
		res.status(500).send({ error: `Error en eliminar producto ${error}` });
	}
};

const productsController = {
	getProducts,
	getProduct,
	postProduct,
	putProduct,
	deleteProduct,
};

export default productsController;
