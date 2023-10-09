import { Router } from 'express';
import routerCart from './carts.routes.js';
import routerMessage from './messages.routes.js';
import routerProd from './products.routes.js';
import routerUser from './users.routes.js';
import routerSession from './sessions.routes.js';
import routerHandlebars from './handlebars.routes.js';

const router = Router();

router.use('/api/products', routerProd);
router.use('/api/messages', routerMessage);
router.use('/api/cart', routerCart);
router.use('/api/users', routerUser);
router.use('/api/sessions', routerSession);
router.use('/static', routerHandlebars);

export default router;
