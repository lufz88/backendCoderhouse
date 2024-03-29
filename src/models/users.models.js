import { Schema, model } from 'mongoose';
import cartModel from './carts.models.js';

const fileSchema = new Schema(
	{
		name: String,
		reference: String,
	},
	{ _id: false }
);

const userSchemna = new Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	rol: {
		type: String,
		default: 'user',
	},
	cart: {
		type: Schema.Types.ObjectId,
		ref: 'carts',
	},
	age: {
		type: Number,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	documents: [fileSchema],
	last_connection: { type: Date },
});

const userModel = model('users', userSchemna);

export default userModel;
