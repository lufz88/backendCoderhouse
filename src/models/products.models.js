import { Schema, model } from 'mongoose';

const productSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	stock: {
		type: Number,
		required: true,
	},
	code: {
		type: String,
		required: true,
		unique: true,
	},
	status: {
		type: Boolean,
		default: true,
	},
	thumbnail: [],
});

const productModel = model('products', productSchema);

export default productModel;
