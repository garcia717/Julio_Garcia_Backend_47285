import express from 'express';
import {passportError, authorization} from '../utils/messageError.js'
import {editAmountOnCart, editProductOnCart, getCartByID, addProductToCart, deleteCart, deleteProductFromCart} from '../controllers/carts.controller.js'

const cartRouter = express.Router();

cartRouter.get('/:cid', getCartByID);
cartRouter.post('/:cid/product/:pid', addProductToCart);
cartRouter.delete('/:cid', passportError('jwt'), authorization('Admin'),deleteCart);
cartRouter.delete('/:cid/products/:pid', deleteProductFromCart);
cartRouter.put('/:cid', editProductOnCart);
cartRouter.put('/:cid/products/:pid', editAmountOnCart);

export default cartRouter;