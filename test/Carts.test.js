import 'dotenv/config';

import cartModel from '../src/models/carts.models.js';
import Assert from 'assert';
import mongoose from 'mongoose';

await mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('DB conectada'))
	.catch(error => console.log(`Error en conexión a MongoDB Atlas:  ${error}`));

const assert = Assert.strict;

describe('Testing Carts', () => {
	beforeEach(function () {
		this.timeout(7000);
	});

	it('Consultar todos los carritos de mi aplicacion', async function () {
		const carts = await cartModel.find();
		assert.strictEqual(Array.isArray(carts), true);
	});

	it('Consultar un carrito por su id', async function () {
		const cart = await cartModel.findById('653ee4a7e985f7d3aa64f831');
		assert.strictEqual(typeof cart, 'object');
	});

	it('Crear un nuevo carrito', async function () {
		const resultado = await cartModel.create({});
		assert.ok(resultado._id);
	});
});
