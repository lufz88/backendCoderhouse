import { promises as fs } from 'fs';

export class ProductManager {
	constructor(path) {
		this.products = [];
		this.path = path;
	}

	async addProduct(product) {
		this.products = JSON.parse(await fs.readFile(path, 'utf-8'));
		const { title, description, price, thumbnail, code, stock } = product;

		if (!title || !description || !price || !thumbnail || !code || !stock) {
			console.log(
				'El producto debe incluir los campos title, description, price, thumbnail, code y stock'
			);
			return;
		}

		this.products.find(element => element.code == product.code)
			? console.log('El código del producto ya existe')
			: this.products.push(product);

		let writeProducts = JSON.stringify(this.products);
		await fs.writeFile(this.path, writeProducts);
	}

	async getProducts() {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		return this.products;
	}

	async getProductById(id) {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		return this.products.find(product => product.id == id) ?? console.log('Not Found');
	}

	async updateProducts(id, update) {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		let product = this.products.find(prod => prod.id == id);
		let keys = Object.keys(update);
		keys.map(key => key !== 'id' && (product[key] = update[key]));
		let writeProducts = JSON.stringify(this.products);
		await fs.writeFile(this.path, writeProducts);
	}

	async deleteProduct(id) {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		this.products = this.products.filter(prod => prod.id !== id);
		let writeProducts = JSON.stringify(this.products);
		await fs.writeFile(this.path, writeProducts);
	}
}

class Product {
	constructor({ title, description, price, thumbnail, code, stock }) {
		this.title = title;
		this.description = description;
		this.price = price;
		this.thumbnail = thumbnail;
		this.code = code;
		this.stock = stock;
		this.id = Product.incrementarID();
	}

	static incrementarID() {
		this.idIncrement ? this.idIncrement++ : (this.idIncrement = 1);
		return this.idIncrement;
	}
}
