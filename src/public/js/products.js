const socket = io();

const productsContainer = document.querySelector('#products-container');
const pageNumber = document.querySelector('#page-number');
const previousButton = document.querySelector('#prev-page-button');
const nextButton = document.querySelector('#next-page-button');

let page;

socket.emit('load');

socket.on('products', data => {
	const products = data.docs;
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
	page = data.page;
	pageNumber.innerText = page;
	!data.hasPrevPage ? (previousButton.disabled = true) : (previousButton.disabled = false);
	!data.hasNextPage ? (nextButton.disabled = true) : (nextButton.disabled = false);
});

console.log(page);
previousButton.addEventListener('click', () => {
	page--;
	socket.emit('previousPage', page);
});

nextButton.addEventListener('click', () => {
	page++;
	socket.emit('nextPage', page);
});
