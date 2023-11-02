import { faker } from '@faker-js/faker';

const createProducts = (req, res) => {
	let products = [];
	for (let i = 0; i < 100; i++) {
		const product = {
			_id: faker.database.mongodbObjectId(),
			title: faker.commerce.productName(),
			description: faker.commerce.productDescription(),
			category: faker.commerce.department(),
			price: faker.commerce.price(),
			stock: faker.number.int({ min: 10, max: 100 }),
			code: faker.string.uuid(),
			status: faker.datatype.boolean(),
			thumbnail: [],
		};
		products.push(product);
	}
	return res.status(200).send({ respuesta: 'Productos generados', productos: products });
};

const mocksController = { createProducts };

export default mocksController;
