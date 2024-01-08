const productsContainer = document.querySelector('#products-container');
const pageNumber = document.querySelector('#page-number');
const previousButton = document.querySelector('#prev-page-button');
const nextButton = document.querySelector('#next-page-button');
const mensaje = document.querySelector('#bienvenida');
const purchaseButton = document.querySelector('#purchase-button');
const logoutButton = document.querySelector('#logout-button');
const cartId = document.querySelector('#cart-ID').innerText.split(' ')[1];

let page = 1;

async function showPurchaseButton() {
	const res = await fetch(`http://localhost:3000/api/carts/${cartId}`);
	const data = await res.json();
	const hayProductos = data.message.products.length >= 1;
	if (hayProductos) {
		purchaseButton.disabled = false;
	} else {
		purchaseButton.disabled = true;
	}
}

async function getProducts(URL, page) {
	let urlFetch = URL;

	if (page) {
		urlFetch += `?page=${page}`;
	}
	const res = await fetch(urlFetch);
	const data = await res.json();
	const products = data.docs;
	productsContainer.innerHTML = '';
	products.forEach(prod => {
		pid = prod._id;
		productsContainer.innerHTML += `
    <div class="product-container">
			<div class="data-container">
      <p>Title: ${prod.title}</p>
      <p>Description: ${prod.description}</p>
      <p>Category: ${prod.category}</p>
      <p>Price: ${prod.price}</p>
      <p>Code: ${prod.code}</p>
      <p>Stock: ${prod.stock}</p>
      <p>Status: ${prod.status}</p>
			</div>
			<button id=${pid} class="add-button">
			Agregar al carrito
			</button>

    </div>
    `;
	});
	page = data.page;
	pageNumber.innerText = page;
	!data.hasPrevPage ? (previousButton.disabled = true) : (previousButton.disabled = false);
	!data.hasNextPage ? (nextButton.disabled = true) : (nextButton.disabled = false);

	const addButtons = document.querySelectorAll('.add-button');
	addButtons.forEach(button => {
		button.addEventListener('click', async e => {
			const pid = e.target.id;

			const data = await addProduct(cartId, pid);
			if (data.resultado === 'OK') {
				showPurchaseButton();
				Swal.fire({
					title: `Producto agregado`,
				});
			} else {
				Swal.fire({
					title: `Error al agregar producto: ${error}`,
				});
			}
		});
	});
}

async function addProduct(cartId, pid) {
	const res = await fetch(`http://localhost:3000/api/carts/${cartId}/product/${pid}`, {
		method: 'POST',
		body: JSON.stringify({}),
	});
	const data = await res.json();
	return data;
}

previousButton.addEventListener('click', async () => {
	page--;
	await getProducts('http://localhost:3000/api/products', page);
});

nextButton.addEventListener('click', async () => {
	page++;
	await getProducts('http://localhost:3000/api/products', page);
});

logoutButton.addEventListener('click', async () => {
	const res = await fetch('http://localhost:3000/api/session/logout');
	const data = await res.json();
	if (data.resultado === 'Login eliminado') {
		Swal.fire({
			title: 'Ha cerrado sesión',
		}).then(() => {
			window.location.href = '/static/home';
		});
	}
});

purchaseButton.addEventListener('click', async () => {
	const res = await fetch(`http://localhost:3000/api/carts/${cartId}/purchase`, {
		method: 'POST',
		body: JSON.stringify({}),
	});
	const data = await res.json();
	Swal.fire({
		title: '¡Compra finalizada!',
		html: `
    Su número de ticket es: <b>${data.mensaje.ticketGenerado.code}</b><br>
    El valor de su compra es: ${data.mensaje.ticketGenerado.amount}
		`,

		icon: 'success',
	});
	showPurchaseButton();
});

getProducts('http://localhost:3000/api/products', page);

showPurchaseButton();
