const socket = io();

const cartContainer = document.querySelector('#cart-container');

const path = window.location.pathname;
const cid = path.slice(path.length);

socket.emit('loadCart', cid);

socket.on('cartProducts', products => {
	cartContainer.innerHTML = '';
	products.forEach(prod => {
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
    </div>
    `;
	});
});
