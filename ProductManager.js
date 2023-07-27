import fs from 'fs';

class ProductManager {
	constructor(path) {
		this.products = [];
		this.path = path;
		this.newProductId = 1;
	}

	addProduct(product) {
		this.readFile();
		const { title, description, price, thumbnail, code, stock } = product;

		if (!title || !description || !price || !thumbnail || !code || !stock) {
			console.log(
				'El producto debe incluir los campos title, description, price, thumbnail, code y stock'
			);
			return;
		}

		this.products.find(element => element.code == product.code)
			? console.log('El código del producto ya existe')
			: this.products.push({ ...product, id: this.newProductId });

		this.newProductId++;
		let writeProducts = JSON.stringify(this.products);
		fs.writeFileSync(this.path, writeProducts);
	}

	getProducts() {
		this.readFile();
		return this.products;
	}

	getProductById(id) {
		this.readFile();
		return this.products.find(product => product.id == id) ?? console.log('Not Found');
	}

	updateProducts(id, update) {
		this.readFile();
		let product = this.products.find(prod => prod.id == id);
		let keys = Object.keys(update);
		keys.map(key => key !== 'id' && (product[key] = update[key]));
		let writeProducts = JSON.stringify(this.products);
		fs.writeFileSync(this.path, writeProducts);
	}

	deleteProduct(id) {
		this.readFile();
		this.products = this.products.filter(prod => prod.id !== id);
		let writeProducts = JSON.stringify(this.products);
		fs.writeFileSync(this.path, writeProducts);
	}

	readFile() {
		let resultado = fs.readFileSync(this.path, 'utf-8');
		this.products = JSON.parse(resultado);
	}
}

const manager = new ProductManager('products.txt');

manager.addProduct({
	title: 'Pantalón',
	description: 'Un producto',
	price: 500,
	thumbnail: 'http://',
	code: 154,
	stock: 43,
});
manager.addProduct({
	title: 'Pantalón',
	description: 'Un producto',
	price: 500,
	thumbnail: 'http://',
	code: 124,
	stock: 43,
});

let products = manager.getProducts();
manager.updateProducts(2, { title: 'coco', stock: 12, id: 3 });
products = manager.getProducts();
console.log(products);
