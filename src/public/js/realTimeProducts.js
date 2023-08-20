const socket = io();

const form = document.querySelector('#formProduct');
const productsContainer = document.querySelector('#products-container');

socket.emit('load');

form.addEventListener('submit', event => {
	event.preventDefault();
	const dataForm = new FormData(event.target);
	const product = Object.fromEntries(dataForm);
	Swal.fire({
		title: 'Producto creado',
	});

	socket.emit('newProduct', product);
});

socket.on('products', products => {
	productsContainer.innerHTML = '';
	products.forEach(prod => {
		productsContainer.innerHTML += `
    <div class="product-container">
      <p>Id: ${prod.id}</p>
      <p>Title: ${prod.title}</p>
      <p>Description: ${prod.description}</p>
      <p>Price: ${prod.price}</p>
      <p>Status: ${prod.status}</p>
      <p>Code: ${prod.code}</p>
      <p>Stock: ${prod.stock}</p>

    </div>
  
    `;
	});
});
