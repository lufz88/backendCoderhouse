import ticketModel from '../models/tickets.models.js';
import { v4 as uuidv4 } from 'uuid';
import cartsController from './carts.controller.js';

const createTicket = async (req, res) => {
	const { amount, email } = req.query;
	try {
		const ticket = {
			code: uuidv4(),
			amount: amount,
			purchaser: email,
		};
		ticketModel.create(ticket);
		res.status(200).send({ response: 'Ticket generado con éxito', message: ticket });
	} catch (error) {
		res.status(500).send({ mensaje: `Error al crear el ticket ${error}` });
	}
};

const ticketsController = { createTicket };

export default ticketsController;
