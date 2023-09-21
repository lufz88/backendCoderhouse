const socket = io();

const productsContainer = document.querySelector('#products-container');
const pageNumber = document.querySelector('#page-number');
const previousButton = document.querySelector('#prev-page-button');
const nextButton = document.querySelector('#next-page-button');
const mensaje = document.querySelector('#bienvenida');
const logoutButton = document.querySelector('#logout-button');

let page;
let cartId;

socket.emit('load');

socket.on('products', info => {
	const { data, user } = info;
	mensaje.innerText = `Bienvenido ${user.first_name} ${user.last_name}
	Email: ${user.email}
	Rol: ${user.rol}
	Edad: ${user.age}`;

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
		button.addEventListener('click', e => {
			const pid = e.target.id;
			const data = { pid, cartId };
			socket.emit('addProduct', data);
		});
	});
});

previousButton.addEventListener('click', () => {
	page--;
	socket.emit('previousPage', page);
});

nextButton.addEventListener('click', () => {
	page++;
	socket.emit('nextPage', page);
});

socket.on('success', cid => {
	cartId = cid;
	Swal.fire({
		title: 'Producto agregado',
	});
});

logoutButton.addEventListener('click', () => {
	Swal.fire({
		title: '¿Seguro?',
	}).then(res => {
		if (res) {
			socket.emit('logout');
		}
	});
});

socket.on('logoutOk', () => {
	window.location.href = '/static';
});
