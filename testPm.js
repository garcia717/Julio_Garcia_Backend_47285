const ProductManager = require("./productManager");

const manager = new ProductManager();

try {
  console.log(manager.getProducts());

  manager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  });
  console.log(manager.getProducts());

  try {
    manager.addProduct({
        title: "producto prueba",
        description: "Este es un producto prueba",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 25,
    });
  } catch (error) {
    console.error(` ${error.message}`);
  }
  console.log(manager.getProducts());
  const productById = manager.getProductById(1); 
  console.log(productById);
  const nonExistentProduct = manager.getProductById(6);  
  console.log(nonExistentProduct);
} catch (error) {
  console.error(error.message);
}