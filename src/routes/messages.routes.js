import { Router } from 'express';
import messagesController from '../controllers/messages.controller.js';

const routerMessage = Router();

routerMessage.get('/', messagesController.getMessages);

routerMessage.post('/', messagesController.postMessage);

export default routerMessage;
