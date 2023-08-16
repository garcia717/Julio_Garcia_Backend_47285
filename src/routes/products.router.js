import express from 'express';
import ProductManager from './src/productManager';

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
    res.status(500).send("Error al obtener los productos");
  }
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send("Producto no existente");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener el producto");
  }
});



export default productsRouter;