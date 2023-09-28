import { Router } from 'express';

const routerHandlebars = Router();

routerHandlebars.get('/home', (req, res) => {
	res.render('index', {
		rutaCSS: 'index',
		rutaJS: 'index',
	});
});

routerHandlebars.get('/realtimeproducts', (req, res) => {
	res.render('realTimeProducts', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'realTimeProducts',
	});
});

routerHandlebars.get('/chat', (req, res) => {
	res.render('chat', {
		rutaCSS: 'chat',
		rutaJS: 'chat',
	});
});

routerHandlebars.get('/products', (req, res) => {
	const user = req.session.user;
	res.render('products', {
		rutaCSS: 'products',
		rutaJS: 'products',
		user,
	});
});

routerHandlebars.get('/carts/:cid', (req, res) => {
	const { cid } = req.params;
	cartId = cid;
	res.redirect('/carts');
});

routerHandlebars.get('/carts', (req, res) => {
	res.render('carts', {
		rutaCSS: 'carts',
		rutaJS: 'carts',
	});
});

routerHandlebars.get('/register', (req, res) => {
	res.render('register', {
		rutaCSS: 'register',
		rutaJS: 'register',
	});
});

export default routerHandlebars;
