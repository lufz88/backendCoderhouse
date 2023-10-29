import { Router } from 'express';
import mailingController from '../controllers/mail.constroller.js';

const routerMailing = Router();

routerMailing.get('/', mailingController.sendEmail);

export default routerMailing;
