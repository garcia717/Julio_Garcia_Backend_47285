document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const socket = io()
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const formData = new FormData(form);
      const productData = {};
  
      formData.forEach((value, key) => {
        productData[key] = value;
      });
      
      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
  
        if (response.ok) {
          alert('Producto agregado exitosamente');
          form.reset();
          socket.emit('updateProducts', productData);
        } else {
          alert('Error al agregar el producto');
        }
      } catch (error) {
        console.error('Error:', error);
      }
      return false;
    });
});

socket.on('updatedProducts', (products) => {
  console.log('Event updatedProducts received:', products); 
const productList = document.getElementById('productList');
productList.innerHTML = '';

products.forEach((product) => {
  const productItem = document.createElement('li');
  productItem.textContent = `${product.title} - ${product.price}`;
  productList.appendChild(productItem);
});
});