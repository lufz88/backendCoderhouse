const socket = io();

const cartContainer = document.querySelector('#cart-container');

const path = window.location.pathname;
const cid = path.slice(path.length);
// '64ff2f437164de88610bd673';

socket.emit('loadCart');

socket.on('cartProducts', products => {
	cartContainer.innerHTML = '';
	const title = document.createElement('h2');
	title.innerText = `ID: ${cid}`;
	cartContainer.appendChild(title);
	products.forEach(prod => {
		cartContainer.innerHTML += `
    <div class="product-container">
			<div class="data-container">
        <p>Title: ${prod.id_prod.title}</p>
        <p>Description: ${prod.id_prod.description}</p>
        <p>Category: ${prod.id_prod.category}</p>
        <p>Price: ${prod.id_prod.price}</p>
        <p>Code: ${prod.id_prod.code}</p>
        <p>Stock: ${prod.id_prod.stock}</p>
        <p>Status: ${prod.id_prod.status}</p>
			</div>
    </div>
    `;
	});
});
