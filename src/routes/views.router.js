import express from 'express';
import { __dirname } from '../path.js';
import { productModel } from '../models/products.models.js';


const viewsRouter = express.Router();



viewsRouter.get('/home', async (req, res) => {
    try {
        const products = await productModel.find().exec();
        res.render('partials/home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar los productos');
    }
  });

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('partials/realTimeProducts' ); 
  });

  viewsRouter.get('/chat', (req, res) => {
    res.render('partials/chat');
  });

  viewsRouter.get('/login', (req, res) => {
    res.render('partials/login'); 
  });

  viewsRouter.get('/', (req, res)=>{
<<<<<<< HEAD

=======
  
>>>>>>> Passport+Routes-adv
    res.render('index')
  });
  
export default viewsRouter;