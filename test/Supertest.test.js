import 'dotenv/config';

import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

const expect = chai.expect;
const requester = supertest('http://localhost:3000');

await mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('DB conectada'))
	.catch(error => console.log(`Error en conexión a MongoDB Atlas:  ${error}`));

describe('Testing Aplicación', () => {
	describe('Test de registro de usuario', () => {
		let token = '';
		let cookie = '';
		before(async function () {
			this.timeout(7000);
			const response = await requester.post('/api/session/login').send({
				email: process.env.ADMIN_USER,
				password: process.env.ADMIN_PASSWORD,
			});
			cookie = response.headers['set-cookie'][0];
			token = cookie.split(';')[0].split('=')[1];
			expect(token).to.be.ok;
		});

		let uid;
		it('Test endpoint /api/session/register, se espera que cree un usuario', async function () {
			this.timeout(5000);

			const newUser = {
				first_name: 'Pepe',
				last_name: 'Pepon',
				email: 'pepe@pepon.com',
				age: 45,
				password: 'constraseña',
			};

			const response = await requester.post('/api/session/register').send(newUser);
			uid = response.body.user._id;
			expect(response.body.mensaje).to.equal('Usuario creado');
		});

		it('Test endpoint /api/users/:uid, se espera que elimine un usuario', async function () {
			const response = await requester.delete(`/api/users/${uid}`).set('Cookie', cookie);
			expect(response.body.mensaje).to.equal('Usuario eliminado');
		});

		describe('Test de rutas de productos', () => {
			let token = '';
			let pid = '';
			let cookie = '';
			before(async function () {
				this.timeout(7000);
				const response = await requester.post('/api/session/login').send({
					email: process.env.ADMIN_USER,
					password: process.env.ADMIN_PASSWORD,
				});
				cookie = response.headers['set-cookie'][0];
				token = cookie.split(';')[0].split('=')[1];
				expect(token).to.be.ok;
			});

			it('Test endpoint /api/products, debe crear un nuevo producto', async function () {
				const newProduct = {
					title: 'Pantalón',
					description: 'Pantalón de jean negro',
					category: 'Pantalones',
					price: 4555,
					stock: 1515,
					code: 'ABS545',
				};
				const response = await requester
					.post('/api/products')
					.set('Cookie', cookie)
					.send(newProduct);
				pid = response.body.product._id;
				expect(response.body.mensaje).to.equal('Producto creado');
			});

			it('Test endpoint /api/products/:id, debe modificar un producto', async function () {
				const updateProduct = {
					title: 'Pantalón',
					description: 'Pantalón de jean azul',
					category: 'Pantalones',
					price: 5000,
					stock: 1515,
					code: 'ABS545',
				};
				const response = await requester
					.put(`/api/products/${pid}`)
					.set('Cookie', cookie)
					.send(updateProduct);
				expect(response.body.mensaje).to.equal('Producto actualizado');
			});

			it('Test endpoint /api/products/:id, Debe eliminar un producto por su id', async function () {
				const response = await requester
					.delete(`/api/products/${pid}`)
					.set('Cookie', cookie);
				expect(response.body.mensaje).to.equal('Producto eliminado');
			});
		});

		describe('Test de rutas de carts', () => {
			let token = '';
			let cookie = '';
			const cid = process.env.TEST_CID;

			before(async function () {
				this.timeout(7000);

				const response = await requester.post('/api/session/login').send({
					email: process.env.TEST_USER,
					password: process.env.TEST_PASSWORD,
				});
				cookie = response.headers['set-cookie'][0];
				token = cookie.split(';')[0].split('=')[1];
				expect(token).to.be.ok;
			});

			it('Test endpoint /api/carts/:cid/product/:pid, debe agregar un nuevo producto al carrito', async function () {
				const pid = '64f65fa3bde9c7cc7fc4de3f';
				const response = await requester
					.post(`/api/carts/${cid}/product/${pid}`)
					.set('Cookie', cookie);
				expect(response.body.resultado).to.equal('OK');
			});

			it('Test endpoint /api/carts/:cid/products/:pid, debe modificar la cantidad de un producto al carrito', async function () {
				const pid = '64f65fa3bde9c7cc7fc4de3f';
				const response = await requester
					.put(`/api/carts/${cid}/product/${pid}`)
					.set('Cookie', cookie)
					.send({ quantity: 8 });
				expect(response.body.message.products[0].quantity).to.equal(9);
			});

			it('Test endpoint /api/carts/:cid/product/:pid, debe eliminar un producto al carrito', async function () {
				const pid = '64f65fa3bde9c7cc7fc4de3f';
				const response = await requester
					.delete(`/api/carts/${cid}/product/${pid}`)
					.set('Cookie', cookie);
				expect(response.body.resultado).to.equal('OK');
			});
		});
	});
});
