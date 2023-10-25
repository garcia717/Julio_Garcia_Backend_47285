import express from 'express';
import { getProducts, getProductById, postProduct, putProductById, deleteProductById } from '../controllers/products.controller.js'

const productsRouter = express.Router();

productsRouter.get('/', getProducts);
productsRouter.get('/:pid', getProductById);
productsRouter.post('/', postProduct);
productsRouter.put('/:pid', putProductById);
productsRouter.delete('/:pid', deleteProductById);


export default productsRouter;


