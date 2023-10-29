import { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
	code: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	purchaser: {
		type: String,
		required: true,
	},
});

ticketSchema.set('timestamps', true);

const ticketModel = model('tickets', ticketSchema);

export default ticketModel;
