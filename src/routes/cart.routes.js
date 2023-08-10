import { Router } from 'express';
import { CartManager } from '../controllers/CartManager.js';

const routerCart = Router();
const cart = new CartManager('./src/models/carts.json');
