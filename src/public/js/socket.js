const socket = io();

socket.on('updatedProducts',async (products) => {
  const productList = await document.getElementById('productList');
  productList.innerHTML = '';

  products.forEach((product) => {
    const productItem = document.createElement('li');
    productItem.textContent = `${product.title} - ${product.price}`;
    productList.appendChild(productItem);
  });
});







