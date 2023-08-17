import { promises as fs } from 'fs';

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = [];
    this.nextId = 1;
    this.loadCarts();
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
      this.nextId = Math.max(...this.carts.map(cart => cart.id), 0) + 1;
    } catch (error) {
      this.carts = [];
      this.nextId = 1;
    }
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts), 'utf-8');
  }

  async createCart() {
    const newCart = {
      id: this.nextId,
      products: [],
    };
    this.carts.push(newCart);
    this.nextId++;
    await this.saveCarts();
    return newCart;
  }

  getCartById(cartId) {
    return this.carts.find(cart => cart.id === cartId);
  }

  async updateCart(cartId, updatedCart) {
    const index = this.carts.findIndex(cart => cart.id === cartId);
    if (index !== -1) {
      this.carts[index] = updatedCart;
      await this.saveCarts();
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    const cartIndex = this.carts.findIndex(cart => cart.id === cartId);
    if (cartIndex !== -1) {
      const cart = this.carts[cartIndex];
      const existingProductIndex = cart.products.findIndex(product => product.id === productId);

      if (existingProductIndex !== -1) {

        cart.products[existingProductIndex].quantity += quantity;
      } else {

        cart.products.push({ id: productId, quantity });
      }

      await this.saveCarts();
      return cart;
    }
  }
}

export default CartManager;