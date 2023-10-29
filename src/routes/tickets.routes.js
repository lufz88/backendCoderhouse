import { Router } from 'express';
import ticketsController from '../controllers/tickets.controller.js';

const routerTicket = Router();

routerTicket.get('/', ticketsController.createTicket);

export default routerTicket;
