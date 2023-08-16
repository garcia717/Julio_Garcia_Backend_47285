import express from 'express';
import CartManager from '../cartManager.js';

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

cartRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      res.status(200).json(cart.products);
    } else {
      res.status(404).send("Carrito no existente");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los productos del carrito");
  }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity;

    const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar el producto al carrito");
  }
});

export default cartRouter;