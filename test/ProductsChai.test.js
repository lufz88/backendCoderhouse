import 'dotenv/config';

import productModel from '../src/models/products.models.js';
import chai from 'chai';
import mongoose from 'mongoose';

await mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('DB conectada'))
	.catch(error => console.log(`Error en conexión a MongoDB Atlas:  ${error}`));

const expect = chai.expect;

describe('Testing Products con Chai', () => {
	beforeEach(function () {
		this.timeout(7000);
	});
	let id;

	it('Crear un nuevo producto', async function () {
		const newProduct = {
			title: 'Pantalón',
			description: 'Pantalón de jean negro',
			category: 'Pantalones',
			price: 4555,
			stock: 1515,
			code: 'ABS445',
		};
		const resultado = await productModel.create(newProduct);
		id = resultado._id;
		expect(resultado._id && true).to.be.ok;
	});

	it('Consultar un producto por Id', async function () {
		const product = await productModel.findById(id);
		expect(typeof product == 'object').to.be.ok;
	});

	it('Eliminar un producto por su id', async function () {
		const product = await productModel.findByIdAndRemove(id);
		expect(typeof product == 'object').to.be.ok;
	});

	it('Consultar todos los productos de mi aplicacion con Chai', async function () {
		const products = await productModel.find();
		expect(Array.isArray(products)).to.be.ok;
	});
});
