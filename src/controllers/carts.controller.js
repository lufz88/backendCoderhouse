import cartModel from '../models/carts.models.js';
import productModel from '../models/products.models.js';
import userModel from '../models/users.models.js';

const getCarts = async (req, res) => {
	//traer los carritos
	const { limit } = req.query;
	try {
		const carts = await cartModel.find().limit(limit);
		res.status(200).send({ resultado: 'OK', message: carts });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carritos: ${error}` });
	}
};

const getCart = async (req, res) => {
	// traer un carrito
	const { cid } = req.params;
	try {
		const cart = await cartModel.findById(cid);
		cart
			? res.status(200).send({ resultado: 'OK', message: cart })
			: res.status(404).send({ resultado: 'Not Found', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carrito: ${error}` });
	}
};

const purchaseCart = async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findById(cid);
		const products = await productModel.find();

		if (cart) {
			const user = await userModel.find({ cart: cart._id });
			const email = user[0].email;
			let amount = 0;
			const purchaseItems = [];
			cart.products.forEach(async item => {
				const product = products.find(prod => prod._id == item.id_prod.toString());
				if (product.stock >= item.quantity) {
					amount += product.price * item.quantity;
					product.stock -= item.quantity;
					await product.save();
					purchaseItems.push(product.title);
				}
				//ticket?info=${amount}
			});
			if (user.rol === 'premium') {
				amount *= 0.9;
			}
			await cartModel.findByIdAndUpdate(cid, { products: [] });
			res.redirect(
				`http://localhost:8080/api/tickets/create?amount=${amount}&email=${email}`
			);
		} else {
			res.status(404).send({ resultado: 'Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carrito: ${error}` });
	}
};

const postCart = async (req, res) => {
	//crear un carrito
	try {
		const respuesta = await cartModel.create({});
		res.status(200).send({ resultado: 'OK', message: respuesta });
	} catch (error) {
		res.status(400).send({ error: `Error al crear carrito: ${error}` });
	}
};

const putProductToCart = async (req, res) => {
	// agregar producto al carrito
	const { cid, pid } = req.params;

	try {
		const cart = await cartModel.findById(cid);
		const product = await productModel.findById(pid);

		if (!product) {
			res.status(404).send({ resultado: 'Product Not Found', message: product });
			return false;
		}

		if (product.stock === 0) {
			console.log(product.stock);
			res.status(400).send({ error: `No hay stock` });
		}

		if (cart) {
			const productExists = cart.products.find(prod => prod.id_prod == pid);

			if (!productExists) {
				cart.products.push({ id_prod: product._id, quantity: 1 });
			} else if (productExists.quantity < product.stock) {
				productExists.quantity++;
			} else {
				return res.status(400).send({ error: `No hay stock suficiente` });
			}

			await cart.save();
			return res.status(200).send({ resultado: 'OK', message: cart });
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
};

const putQuantity = async (req, res) => {
	// agregar cantidad de un producto
	const { cid, pid } = req.params;
	const { quantity } = req.body;
	const product = await productModel.findById(pid);

	if (product.stock < productExists.quantity + quantity) {
		res.status(400).send({ error: `No hay stock suficiente` });
	}

	try {
		const cart = await cartModel.findById(cid);

		if (cart) {
			const productExists = cart.products.find(prod => prod.id_prod == pid);
			if (productExists) {
				productExists.quantity += quantity;
			} else {
				res.status(404).send({ resultado: 'Product Not Found', message: cart });
				return;
			}
			await cart.save();
			res.status(200).send({ resultado: 'OK', message: cart });
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` });
	}
};
const putProductsToCart = async (req, res) => {
	// agregar varios producto al carrito
	const { cid } = req.params;
	const { updateProducts } = req.body;

	try {
		const cart = await cartModel.findById(cid);
		updateProducts.forEach(prod => {
			const productExists = cart.products.find(cartProd => cartProd.id_prod == prod.id_prod);
			if (productExists) {
				productExists.quantity += prod.quantity;
			} else {
				cart.products.push(prod);
			}
		});
		await cart.save();
		cart
			? res.status(200).send({ resultado: 'OK', message: cart })
			: res.status(404).send({ resultado: 'Not Found', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` });
	}
};

const deleteCart = async (req, res) => {
	// eliminar todos los productos del carrito
	const { cid } = req.params;
	try {
		const cart = await cartModel.findByIdAndUpdate(cid, { products: [] });
		cart
			? res.status(200).send({ resultado: 'OK', message: cart })
			: res.status(404).send({ resultado: 'Not Found', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al vaciar el carrito: ${error}` });
	}
};

const deleteProductFromCart = async (req, res) => {
	// eliminar un producto

	const { cid, pid } = req.params;

	try {
		const cart = await cartModel.findById(cid);
		if (cart) {
			const productIndex = cart.products.findIndex(prod => prod.id_prod == pid);
			let deletedProduct;
			if (productIndex !== -1) {
				deletedProduct = cart.products[productIndex];
				cart.products.splice(productIndex, 1);
			} else {
				res.status(404).send({ resultado: 'Product Not Found', message: cart });
				return;
			}
			await cart.save();
			res.status(200).send({ resultado: 'OK', message: deletedProduct });
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al eliminar producto: ${error}` });
	}
};

const cartsController = {
	getCarts,
	getCart,
	postCart,
	putProductsToCart,
	putProductToCart,
	putQuantity,
	deleteCart,
	deleteProductFromCart,
	purchaseCart,
};

export default cartsController;
