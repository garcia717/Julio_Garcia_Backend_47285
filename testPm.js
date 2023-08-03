const ProductManager = require("./productManager");

function test() {
  const manager = new ProductManager("./products.json");

  console.log("getProducts() al principio:");
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

    console.log("\nProducto agregado satisfactoriamente:");
    console.log(manager.getProducts());

    const productById = manager.getProductById(1); // Suponiendo que el id generado es 1
    console.log("\nProducto por ID:");
    console.log(productById);

    // Intentamos agregar el mismo producto con el mismo código
    try {
      manager.addProduct({
        title: "producto repetido",
        description: "Este producto ya existe",
        price: 150,
        thumbnail: "Sin imagen",
        code: "abc123", // Código repetido
        stock: 10,
      });
    } catch (error) {
      console.error(`Error al agregar producto: ${error.message}`);
    }

    console.log("\nProducto después de intentar agregar duplicado:");
    console.log(manager.getProducts());

    manager.updateProduct(1, {
      price: 250
    });
    console.log("\nProducto después de actualizar:");
    console.log(manager.getProducts());

    try {
      manager.deleteProduct(1);
      console.log("\nProducto después de eliminar:");
      console.log(manager.getProducts());
    } catch (error) {
      console.error(`Error al eliminar producto: ${error.message}`);
    }

    console.log("\nProducto después de intentar eliminar de nuevo:");
    console.log(manager.getProducts());
  } catch (error) {
    console.error(error.message);
  }
}

test();