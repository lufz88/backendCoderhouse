import 'dotenv/config';

import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

const expect = chai.expect;
const requester = supertest('http://localhost:8080/');

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

			const { ok, _body } = await requester.post('api/users').send(newUser);
			console.log(ok);
			console.log(_body);
			uid = _body.user._id;
		});

		it('Test endpoint /api/users/:uid, se espera que elimine un usuario', async function () {
			const { _body } = await requester.delete(`api/users/${uid}`);
			console.log(_body);
		});

		describe('Test de rutas de Session', () => {
			let token = '';

			it('Test endpoint /api/sessions/login, se espera que se loguee el usuario', async function () {
				const user = {
					email: 'lucas@pepe.com',
					password: 'peperino',
				};

				const response = await requester.post('api/sessions/login').send(user);
				const cookie = response.headers['set-cookie'][0];
				token = cookie.split(';')[0].split('=')[1];
				console.log(response.statusCode);
			});

			it('Test endpoint /api/sessions/current', async function () {
				const { statusCode, ok } = await requester
					.get('api/sessions/current')
					.set('Cookie', [`jwtCookie=${token}`]);
				console.log(statusCode, ok);
			});

			it('Test endpoint /api/sessions/logout, se espera que elimine la sesion', async function () {
				const response = await requester.get(`api/sessions/logout`);
				const cookies = response.headers['set-cookie'];
				console.log(response.statusCode, cookies);
			});
		});

		describe('Test de rutas de productos', () => {
			let token = '';
			let pid = '';
			before(async function () {
				this.timeout(7000);
				const response = await requester.post('/api/sessions/login').send({
					email: 'lucas@pepe.com',
					password: 'peperino',
				});

				const cookie = response.headers['set-cookie'][0];
				token = cookie.split(';')[0].split('=')[1];
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
					.post('api/products')
					.set('Cookie', [`jwtCookie=${token}`])
					.send(newProduct);
				pid = response._id;
				console.log(response._body);
			});
		});
	});

	// email: 'loco@lope.com',
	// 			age: 45,
	// 			password: 'elpepe',
});
