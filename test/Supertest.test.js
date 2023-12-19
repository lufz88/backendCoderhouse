import 'dotenv/config';

import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

await mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('DB conectada'))
	.catch(error => console.log(`Error en conexión a MongoDB Atlas:  ${error}`));

describe('Testing Aplicación', () => {
	describe('Test de registro de usuario', () => {
		let uid;
		it('Test endpoint /api/users, se espera que cree un usuario', async function () {
			this.timeout(5000);

			const newUser = {
				first_name: 'Cacho',
				last_name: 'Castaña',
				email: 'cacho@castaña.com',
				age: 45,
				password: 'siteagarro',
			};

			const { _body } = await requester.post('/api/users').send(newUser);
			uid = _body.user._id;
			expect(_body.mensaje).to.equal('Usuario creado');
		});

		it('Test endpoint /api/users/:uid, se espera que elimine un usuario', async function () {
			const { _body } = await requester.delete(`/api/users/${uid}`);
			expect(_body.mensaje).to.equal('Usuario eliminado');
		});

		describe('Test de rutas de productos', () => {
			let token = '';
			let pid = '';
			let cookie = '';
			before(async function () {
				this.timeout(7000);
				const response = await requester.post('/api/sessions/login').send({
					email: 'lucas@pepe.com',
					password: 'peperino',
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

			it('Eliminar un producto por su id', async function () {
				const response = await requester
					.delete(`/api/products/${pid}`)
					.set('Cookie', cookie);
				expect(response.body.mensaje).to.equal('Producto eliminado');
			});
		});

		describe('Test de rutas de carts', () => {
			let token = '';
			let uid = '';
			let cid = '';
			let cookie = '';

			before(async function () {
				this.timeout(7000);

				const newUser = {
					first_name: 'Cacho',
					last_name: 'Castaña',
					email: 'cacho@castaña.com',
					age: 45,
					password: 'siteagarro',
				};

				const { _body } = await requester.post('/api/users').send(newUser);
				uid = _body.user._id;
				cid = _body.user.cart;
				const response = await requester.post('/api/sessions/login').send({
					email: newUser.email,
					password: newUser.password,
				});
				cookie = response.headers['set-cookie'][0];
				token = cookie.split(';')[0].split('=')[1];
				expect(token).to.be.ok;
			});

			it('Test endpoint /api/carts/:cid/product/:pid, debe agregar un nuevo producto al carrito', async function () {
				const pid = '64f65fa3bde9c7cc7fc4de3f';
				const response = await requester
					.put(`/api/carts/${cid}/product/${pid}`)
					.set('Cookie', cookie);
				expect(response.body.resultado).to.equal('OK');
			});

			it('Test endpoint /api/carts/:cid/products/:pid, debe modificar la cantidad de un producto al carrito', async function () {
				const pid = '64f65fa3bde9c7cc7fc4de3f';
				const response = await requester
					.put(`/api/carts/${cid}/products/${pid}`)
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

			it('Test endpoint /api/users/:uid, se espera que elimine un usuario', async function () {
				const { _body } = await requester.delete(`/api/users/${uid}`);
				expect(_body.mensaje).to.equal('Usuario eliminado');
			});
		});
	});

	// email: 'loco@lope.com',
	// 			age: 45,
	// 			password: 'elpepe',
});
