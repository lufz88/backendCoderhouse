import { promises as fs } from 'fs';

export class CartManager {
	constructor(cartsPath, productsPath) {
		this.carts = [];
		this.cartsPath = cartsPath;
		this.productsPath = productsPath;
	}

	async createCart() {
		this.carts = JSON.parse(await fs.readFile(this.cartsPath, 'utf-8'));
		const newCart = { id: CartManager.incrementId(this.carts), products: [] };
		this.carts.push(newCart);
		const writeCarts = JSON.stringify(this.carts);
		await fs.writeFile(this.cartsPath, writeCarts);
	}

	async getProductsFromCart(id) {
		this.carts = JSON.parse(await fs.readFile(this.cartsPath, 'utf-8'));
		const cart = this.carts.find(cart => cart.id === id);

		if (cart) {
			return cart.products;
		} else {
			return false;
		}
	}
	async addProductToCart(cid, pid) {
		this.carts = JSON.parse(await fs.readFile(this.cartsPath, 'utf-8'));
		const cart = this.carts.find(cart => cart.id === cid);

		const products = JSON.parse(await fs.readFile(this.productsPath, 'utf-8'));
		const product = products.find(prod => prod.id === pid);

		if (!product) {
			return false;
		}

		if (cart) {
			const productExist = cart.products.find(prod => prod.id === pid);
			productExist
				? productExist.quantity++
				: cart.products.push({ id: product.id, quantity: 1 });
			const writeCarts = JSON.stringify(this.carts);
			await fs.writeFile(this.cartsPath, writeCarts);
			return true;
		} else {
			return false;
		}
	}

	static incrementId(carts) {
		const ids = carts.map(cart => cart.id);
		let newId = 1;
		carts.length > 0 && (newId = Math.max(...ids) + 1);
		return newId;
	}
}
