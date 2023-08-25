const socket = io();

socket.on('updatedProducts', (products) => {
    console.log('Event updateProducts received:', products); 
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  products.forEach((product) => {
    const productItem = document.createElement('li');
    productItem.textContent = `${product.title} - ${product.price}`;
    productList.appendChild(productItem);
  });
});







