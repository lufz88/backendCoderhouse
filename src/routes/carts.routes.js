import { Router } from 'express';
import cartsController from '../controllers/carts.controller.js';
import { authorization, passportError } from '../utils/messageErrors.js';
const routerCart = Router();

routerCart.get('/', cartsController.getCarts);
routerCart.get('/:cid', cartsController.getCart);
routerCart.post('/:cid/purchase', cartsController.purchaseCart);
routerCart.post('/', cartsController.postCart);
routerCart.put(
	'/:cid/product/:pid',
	passportError('jwt'),
	authorization('user'),
	cartsController.putProductToCart
);
routerCart.put(
	'/:cid/products/:pid',
	passportError('jwt'),
	authorization('user'),
	cartsController.putQuantity
);
routerCart.put(
	'/:cid',
	passportError('jwt'),
	authorization('user'),
	cartsController.putProductsToCart
);
routerCart.delete('/:cid', passportError('jwt'), authorization('user'), cartsController.deleteCart);
routerCart.delete(
	'/:cid/products/:pid',
	passportError('jwt'),
	authorization('user'),
	cartsController.deleteProductFromCart
);
export default routerCart;
