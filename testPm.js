const ProductManager = require("./productManager");

async function test() {
  const manager = new ProductManager("./products.json");

  // Cargamos los productos desde el archivo


  console.log("getProducts() al principio:");
  console.log(manager.getProducts());

  try {
    await manager.addProduct({
      title: "producto prueba 1",
      description: "Este es el producto de prueba 1",
      price: 100,
      thumbnail: "imagen1.jpg",
      code: "abc123",
      stock: 10,
    });

    console.log("\nProducto agregado satisfactoriamente:");
    console.log(manager.getProducts());

    await manager.addProduct({
      title: "producto prueba 2",
      description: "Este es el producto de prueba 2",
      price: 150,
      thumbnail: "imagen2.jpg",
      code: "def456",
      stock: 15,
    });

    console.log("\nProducto agregado satisfactoriamente:");
    console.log(manager.getProducts());

    await manager.addProduct({
      title: "producto prueba 3",
      description: "Este es el producto de prueba 3",
      price: 200,
      thumbnail: "imagen3.jpg",
      code: "ghi789",
      stock: 20,
    });

    console.log("\nProducto agregado satisfactoriamente:");
    console.log(manager.getProducts());

    const productById = manager.getProductById(1);
    console.log("\nProducto por ID:");
    console.log(productById);

    try {
      await manager.addProduct({
        title: "producto repetido",
        description: "Este producto ya existe",
        price: 250,
        thumbnail: "imagen4.jpg",
        code: "abc123",
        stock: 5,
      });
    } catch (error) {
      console.error(`Error al agregar producto duplicado: ${error.message}`);
    }

    console.log("\nProducto después de intentar agregar duplicado:");
    console.log(manager.getProducts());

    await manager.updateProduct(1, {
      price: 300
    });
    console.log("\nProducto después de actualizar:");
    console.log(manager.getProducts());

    try {
      await manager.deleteProduct(2);
      console.log("\nProducto después de eliminar:");
      console.log(manager.getProducts());
    } catch (error) {
      console.error(`Error al eliminar producto: ${error.message}`);
    }

    console.log("\nProducto después de intentar eliminar de nuevo:");
    console.log(manager.getProducts());

    // Guardamos los productos en el archivo

  } catch (error) {
    console.error(error.message);
  }
}

test();