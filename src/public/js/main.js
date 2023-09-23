async function loadProducts() {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }
      const data = await response.json();
      const products = data.payload;
      const productList = document.getElementById('productList');
      productList.innerHTML = ''; 
      products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - ${product.price}`;
        productList.appendChild(li);
      });
  

    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }


 
  window.addEventListener('load', loadProducts);

async function checkSession() {
    try {
      const response = await fetch('/check-session'); 
      if (response.ok) {
        const data = await response.json();
        if (data.loggedIn) {
          
          const userName = data.firstName; 
          const mensajeBienvenida = document.getElementById('mensajeBienvenida');
          mensajeBienvenida.textContent = `Bienvenido, ${userName}.`;
        }
      }
    } catch (error) {
      console.error('Error al verificar la sesión:', error);
    }
  }
  

  window.addEventListener('load', checkSession);

  
 


