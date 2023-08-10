import { promises as fs } from 'fs';

export class CartManager {
	constructor(path) {
		this.products = [];
		this.path = path;
		this.id = CartManager.incrementarID();
	}
	static incrementarID() {
		this.idIncrement ? this.idIncrement++ : (this.idIncrement = 1);
		return this.idIncrement;
	}

	async addProduct(product) {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		const productExist = this.products.find(item => item.id === product.id);
		productExist
			? productExist.quantity++
			: this.products.push({ id: product.id, quantity: 1 });
		await fs.writeFile(this.path, writeProducts);
	}

	async getProducts() {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));

		return this.products;
	}
}
