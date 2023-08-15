import { promises as fs } from 'fs';

export class ProductManager {
	constructor(path) {
		this.products = [];
		this.path = path;
	}

	async addProduct(product) {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		const { title, description, price, code, stock, status } = product;

		if (!title || !description || !price || !status || !code || !stock) {
			console.log(
				'El producto debe incluir los campos title, description, price, status, code y stock'
			);
			return;
		}

		const prodExists = this.products.find(element => element.code === code);
		if (prodExists) {
			return false;
		} else {
			product.id = ProductManager.incrementId(this.products);
			product.status = true;
			this.products.push(product);
		}

		let writeProducts = JSON.stringify(this.products);
		await fs.writeFile(this.path, writeProducts);
		return true;
	}

	async getProducts() {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		return this.products;
	}

	async getProductById(id) {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		return this.products.find(product => product.id == id) ?? false;
	}

	async updateProducts(id, update) {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		let product = this.products.find(prod => prod.id == id);
		if (!product) {
			return false;
		}

		let keys = Object.keys(update);
		keys.map(key => key !== 'id' && (product[key] = update[key]));
		let writeProducts = JSON.stringify(this.products);
		await fs.writeFile(this.path, writeProducts);
		return true;
	}

	async deleteProduct(id) {
		const fileProducts = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		this.products = fileProducts.filter(prod => prod.id !== id);
		if (this.products.length === fileProducts.length) {
			return false;
		}
		let writeProducts = JSON.stringify(this.products);
		await fs.writeFile(this.path, writeProducts);
		return true;
	}

	static incrementId(products) {
		const ids = products.map(product => product.id);
		let newId = 1;
		products.length > 0 && (newId = Math.max(...ids) + 1);
		return newId;
	}
}

// class Product {
// 	constructor({ title, description, price, thumbnail, code, stock }) {
// 		this.title = title;
// 		this.description = description;
// 		this.price = price;
// 		this.thumbnail = thumbnail;
// 		this.code = code;
// 		this.stock = stock;
// 		this.id = Product.incrementarID();
// 	}

// 	static incrementarID() {
// 		this.idIncrement ? this.idIncrement++ : (this.idIncrement = 1);
// 		return this.idIncrement;
// 	}
// }
