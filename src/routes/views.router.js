import express from 'express';
import { __dirname } from '../path.js';
import path from 'path';
import ProductManager from '../productManager.js';

const viewsRouter = express.Router();
const productManager = new ProductManager('products.json');


viewsRouter.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('partials/home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar los productos');
    }
  });

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('partials/realTimeProducts' ); 
  });

export default viewsRouter;