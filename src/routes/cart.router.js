import express from 'express';
import CartManager from './src/cartManager';

const cartRouter = express.Router();
const cartManager = new CartManager('cart.json');

cartRouter.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el carrito");
  }
});



export default cartRouter;