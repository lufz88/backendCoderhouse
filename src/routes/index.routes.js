import { Router } from 'express';
import routerCart from './carts.routes.js';
import routerMessage from './messages.routes.js';
import routerProd from './products.routes.js';
import routerUser from './users.routes.js';
import routerSession from './sessions.routes.js';
import routerHandlebars from './handlebars.routes.js';
import routerMailing from './mail.routes.js';
import routerTicket from './tickets.routes.js';
import routerMock from './mocks.routes.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.use('/api/products', routerProd);
router.use('/api/messages', routerMessage);
router.use('/api/carts', routerCart);
router.use('/api/users', routerUser);
router.use('/api/session', routerSession);
router.use('/api/mail', routerMailing);
router.use('/api/tickets', routerTicket);
router.use('/api/mockingproducts', routerMock);
router.get('/loggerTest', (req, res) => {
	logger.debug('Dale, ponete a debbugear');
	logger.info('Acá tenés info sobre algo');
	logger.warning(
		`[WARNING][${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] Alerta: Cuidado, alguna te mandaste`
	);
	logger.error(
		`[ERROR][${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] Ha ocurrido un error: Cuidado, alguna te mandaste`
	);
	logger.fatal(
		`[ERROR FATAL][${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] Ha ocurrido un error fatal: Cuidado, alguna te mandaste`
	);

	res.status(200).send('Prueba de logger concluida');
});

router.use('/static', routerHandlebars);

export default router;
