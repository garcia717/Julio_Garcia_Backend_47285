import express from 'express';
import ProductManager from "../productManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager('products.json');

productsRouter.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    let products = await productManager.getProducts();

    if (limit) {
      const limitValue = parseInt(limit);
      if (!isNaN(limitValue) && limitValue > 0) {
        products = products.slice(0, limitValue);
      }
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos');
  }
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send('Producto no existente');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el producto');
  }
});

productsRouter.post('/', async (req, res) => {
  try {
    const productData = req.body;

    await productManager.addProduct(productData);
    
    res.status(201).send('Producto agregado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el producto');
  }
});

productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;

    await productManager.updateProduct(productId, updatedFields);
    res.status(200).send('Producto actualizado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el producto');
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);

    await productManager.deleteProduct(productId);
    res.status(200).send('Producto eliminado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el producto');
  }
});

export default productsRouter;