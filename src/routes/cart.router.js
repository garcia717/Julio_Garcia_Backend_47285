import express from 'express';
import { cartModel } from '../models/carts.models.js';

const cartRouter = express.Router();



cartRouter.post('/', async (req, res) => {
  try {
    const newCart = await cartModel.create({ products: [] });
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el carrito");
  }
});

cartRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await  cartModel.findById(cartId);

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
    const cartId = req.params.cid
    const productId = req.params.pid
    const quantity = req.body.quantity;

    const updatedCart = await cartModel.findById(cartId);

    if (!cart) {
      return res.status(404).send("Carrito no existente");
    }

    cart.products.push({ id_prod: productId, quantity });
    await cart.save();

    res.status(200).json(cart);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar el producto al carrito");
  }
});


cartRouter.delete('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;

    await cartModel.findByIdAndDelete(cartId);

    res.status(204).send("Carrito eliminado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el carrito");
  }
});

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await cartModel.findById(cartId).populate('products.id_prod');

    if (!updatedCart) {
      return res.status(404).send("Carrito no existente");
    }


    updatedCart.products = updatedCart.products.filter((product) => product.id_prod._id.toString() !== productId);
    await updatedCart.save();

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el producto del carrito");
  }
});

cartRouter.put('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body.products;

    const updatedCart = await cartModel.findByIdAndUpdate(
      cartId,
      { products },
      { new: true }
    ).populate('products.id_prod');  

    if (!updatedCart) {
      return res.status(404).send("Carrito no existente");
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el carrito");
  }
});

cartRouter.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    const updatedCart = await cartModel.findById(cartId).populate('products.id_prod');

    if (!updatedCart) {
      return res.status(404).send("Carrito no existente");
    }


    const productToUpdate = updatedCart.products.find((product) => product.id_prod._id.toString() === productId);
    if (productToUpdate) {
      productToUpdate.quantity = quantity;
      await updatedCart.save();
      res.status(200).json(updatedCart);
    } else {
      res.status(404).send("Producto no encontrado en el carrito");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar la cantidad del producto en el carrito");
  }
});

export default cartRouter;