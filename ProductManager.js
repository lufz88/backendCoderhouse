import fs from 'fs';

class ProductManager {
	constructor(path) {
		this.products = [];
		this.path = path;
	}

	addProduct(product) {
		ProductManager.readFile(this.path);
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
		fs.writeFileSync(this.path, writeProducts);
	}

	getProducts() {
		ProductManager.readFile(this.path);
		return this.products;
	}

	getProductById(id) {
		ProductManager.readFile(this.path);
		return this.products.find(product => product.id == id) ?? console.log('Not Found');
	}

	updateProducts(id, update) {
		ProductManager.readFile(this.path);
		let product = this.products.find(prod => prod.id == id);
		let keys = Object.keys(update);
		keys.map(key => key !== 'id' && (product[key] = update[key]));
		let writeProducts = JSON.stringify(this.products);
		fs.writeFileSync(this.path, writeProducts);
	}

	deleteProduct(id) {
		ProductManager.readFile(this.path);
		this.products = this.products.filter(prod => prod.id !== id);
		let writeProducts = JSON.stringify(this.products);
		fs.writeFileSync(this.path, writeProducts);
	}

	static readFile(path) {
		let resultado = fs.readFileSync(path, 'utf-8');
		this.products = JSON.parse(resultado);
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

// Crear el manager
const manager = new ProductManager('products.txt');

// Añadir productos
manager.addProduct(
	new Product({
		title: 'Pantalón',
		description: 'Un producto',
		price: 500,
		thumbnail: 'http://',
		code: 154,
		stock: 43,
	})
);
manager.addProduct(
	new Product({
		title: 'Pantalón',
		description: 'Un producto',
		price: 500,
		thumbnail: 'http://',
		code: 124,
		stock: 43,
	})
);

manager.addProduct(
	new Product({
		title: 'Pantalón',
		description: 'Un producto',
		price: 500,
		thumbnail: 'http://',
		code: 453,
		stock: 43,
	})
);

// Añadir producto con mismo codigo
manager.addProduct(
	new Product({
		title: 'Pantalón',
		description: 'Un producto',
		price: 500,
		thumbnail: 'http://',
		code: 124,
		stock: 43,
	})
);

// mostrar productos
let products = manager.getProducts();
console.log('Todos los productos: ', products);
// mostrar por ID
console.log('Producto id 2: ', manager.getProductById(2));
// eliminar un producto
manager.deleteProduct(3);
// actualizar un producto
manager.updateProducts(2, { title: 'Remera', stock: 12, id: 3 });
// mostrar productos
products = manager.getProducts();
console.log('Todos los productos: ', products);
