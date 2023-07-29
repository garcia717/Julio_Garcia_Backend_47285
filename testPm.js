const ProductManager = require("./productManager");

const manager = new ProductManager();

try {
  console.log("getProducts() al principio:");
  console.log(manager.getProducts());

  manager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  });

  console.log("\nProducto agregado satisfactoriamente:");
  console.log(manager.getProducts());

  try {
    manager.addProduct({
      title: "producto repetido",
      description: "Este producto ya existe",
      price: 150,
      thumbnail: "Sin imagen",
      code: "abc123", 
      stock: 10,
    });
  } catch (error) {
    console.error(`Error al agregar producto: ${error.message}`);
  }

  console.log("\nProducto después de intentar agregar duplicado:");
  console.log(manager.getProducts());

  const productById = manager.getProductById(1); 
  console.log("\nProducto por ID:");
  console.log(productById);

  const nonExistentProduct = manager.getProductById(6);  
  console.log("\nProducto inexistente:");
  console.log(nonExistentProduct);
} catch (error) {
  console.error(error.message);
}