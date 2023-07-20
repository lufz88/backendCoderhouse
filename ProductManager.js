class ProductManager {
	constructor() {
		this.products = [];
		this.newProductId = 1;
	}

	addProduct(product) {
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
	}

	getProducts() {
		return this.products;
	}

	getProductById(id) {
		return this.products.find(product => product.id == id) ?? console.log('Not Found');
	}
}
