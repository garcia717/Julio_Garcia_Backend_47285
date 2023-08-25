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
    });
});