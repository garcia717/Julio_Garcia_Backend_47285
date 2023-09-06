import express from 'express';
import { productModel } from '../models/products.models.js'; 

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    let products = await productModel.find().exec();

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
    const productId = req.params.pid;
    const product = await productModel.findById(productId).exec();

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
    const newProduct = new productModel(productData);

    await newProduct.save();

    res.status(201).send('Producto agregado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el producto');
  }
});

productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedFields = req.body;

    await productModel.findByIdAndUpdate(productId, updatedFields).exec();
    res.status(200).send('Producto actualizado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el producto');
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;

    await productModel.findByIdAndRemove(productId).exec();
    res.status(200).send('Producto eliminado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el producto');
  }
});

export default productsRouter;