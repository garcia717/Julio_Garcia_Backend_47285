const ProductManager = require("./productManager");

async function testProductManager() {

  const productManager = new ProductManager('products.json');


  const productsEmpty = productManager.getProducts();
  console.log(productsEmpty);

  try {
    const newProductData1 = {
      title: "producto prueba",
      description: "Este es un producto prueba",
      price: 200,
      thumbnail: "Sin imagen",
      code: "abc123",
      stock: 25
    };
    productManager.addProduct(newProductData1);
    const productsAfterAdd1 = productManager.getProducts();
    console.log(productsAfterAdd1);
  } catch (error) {
    console.error(error.message);
  }

  try {
    const newProductData2 = {
      title: "producto prueba",
      description: "Este es un segundo producto prueba",
      price: 300,
      thumbnail: "Sin imagen",
      code: "abc133",
      stock: 25
    };
    productManager.addProduct(newProductData2);
    const productsAfterAdd2 = productManager.getProducts();
    console.log(productsAfterAdd2);
  } catch (error) {
    console.error(error.message);
  }

  const productId = 2;
  const productById = productManager.getProductById(productId);
  console.log(productById);

  const productIdToUpdate = 2;
  const updatedFields = {
    price: 150
  };
  try {
    productManager.updateProduct(productIdToUpdate, updatedFields);
    const updatedProduct = productManager.getProductById(productIdToUpdate);
    console.log(updatedProduct);
  } catch (error) {
    console.error(error.message);
  }

  const productIdToDelete = 2;
  try {
    productManager.deleteProduct(productIdToDelete);
    const productsAfterDelete = productManager.getProducts();
    console.log(productsAfterDelete);
  } catch (error) {
    console.error(error.message);
  }
}

testProductManager();