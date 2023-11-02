import { cartModel } from '../models/carts.models.js';
import {productModel} from '../models/products.models.js';
import { ticketModel } from '../models/tickets.models.js';


export const getCartByID = async (req, res) =>{
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
}

export const addProductToCart = async (req,res)=>{
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
}

export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
    
        await cartModel.findByIdAndDelete(cartId);
    
        res.status(204).send("Carrito eliminado");
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar el carrito");
      }
}

export const deleteProductFromCart = async (req, res) => {
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
}

export const editProductOnCart = async (req, res) => {
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
}

export const editAmountOnCart = async (req, res) => {
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
}

export const finalizePurchase = async (req, res) => {
  try {
      const cartId = req.params.cid;
      const cart = await cartModel.findById(cartId).populate('products.id_prod');

      if (!cart) {
          return res.status(404).send("Carrito no existente");
      }

      const purchaseItems = cart.products;
      const successfullyPurchased = [];
      const failedToPurchase = [];

      for (const purchaseItem of purchaseItems) {
          const product = await productModel.findById(purchaseItem.id_prod._id);

          if (!product) {
              return res.status(404).send(`Producto con ID ${purchaseItem.id_prod._id} no encontrado.`);
          }

          if (product.stock >= purchaseItem.quantity) {

              product.stock -= purchaseItem.quantity;
              await product.save();
              successfullyPurchased.push({ id_prod: purchaseItem.id_prod, quantity: purchaseItem.quantity });
          } else {
              failedToPurchase.push({ id_prod: purchaseItem.id_prod, quantity: purchaseItem.quantity });
          }
      }


      const ticketCode = generateUniqueTicketCode();


      const totalAmount = calculateTotalAmount(successfullyPurchased);


      const purchaser = cart.purchaser;


      const ticketData = {
          code: ticketCode,
          amount: totalAmount,
          purchaser: purchaser,
      };

      const newTicket = new ticketModel(ticketData);
      await newTicket.save();


      const nonPurchasedProducts = failedToPurchase.map((item) => item.id_prod);
      cart.products = cart.products.filter((purchaseItem) =>
          !nonPurchasedProducts.find((nonPurchased) => nonPurchased.equals(purchaseItem.id_prod))
      );
      await cart.save();

      return res.status(200).json({ successfullyPurchased, failedToPurchase });
  } catch (error) {
      console.error(error);
      return res.status(500).send("Error al finalizar la compra.");
  }
};


function generateUniqueTicketCode() {

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

function calculateTotalAmount(purchaseItems) {
  return purchaseItems.reduce((total, item) => {
      const product = item.id_prod;
      const quantity = item.quantity;
      const productPrice = product.price;
      return total + productPrice * quantity;
  }, 0);
}