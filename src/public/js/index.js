const socket = io();

const productsContainer = document.querySelector('#products-container');

socket.emit('load');

socket.on('products', products => {
	productsContainer.innerHTML = '';
	products.forEach(prod => {
		productsContainer.innerHTML += `
    <div class="product-container">
      <p>Title: ${prod.title}</p>
      <p>Description: ${prod.description}</p>
      <p>Category: ${prod.category}</p>
      <p>Price: ${prod.price}</p>
      <p>Code: ${prod.code}</p>
      <p>Stock: ${prod.stock}</p>
      <p>Status: ${prod.status}</p>

    </div>
  
    `;
	});
});
