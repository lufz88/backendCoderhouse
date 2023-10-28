import { Router } from 'express';
import productsController from '../controllers/products.controller.js';
import { authorization, passportError } from '../utils/messageErrors.js';

const routerProd = Router();

routerProd.get('/', productsController.getProducts);
routerProd.get('/:pid', productsController.getProduct);
routerProd.post('/', passportError('jwt'), authorization('admin'), productsController.postProduct);
routerProd.put(
	'/:pid',
	passportError('jwt'),
	authorization('admin'),
	productsController.putProduct
);
routerProd.delete(
	'/:pid',
	passportError('jwt'),
	authorization('admin'),
	productsController.deleteProduct
);

export default routerProd;
