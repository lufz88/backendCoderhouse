import { Router } from 'express';
import messagesController from '../controllers/messages.controller.js';
import { authorization, passportError } from '../utils/messageErrors.js';

const routerMessage = Router();

routerMessage.get('/', messagesController.getMessages);

routerMessage.post(
	'/',
	passportError('jwt'),
	authorization('user'),
	messagesController.postMessage
);

export default routerMessage;
