 fetch('/api/products')
 .then(response => response.json())
 .then(data => {
     const products = data.payload;
     const productList = document.getElementById('productList');
     products.forEach(product => {
         const li = document.createElement('li');
         li.textContent = `${product.title} - ${product.price}`;
         productList.appendChild(li);
     });
 })
 .catch(error => {
     console.error('Error al cargar los productos:', error);
 });

document.getElementById('loginButton').addEventListener('click', () => {

    window.location.href = '/login';
});


window.addEventListener('load', loadProducts);