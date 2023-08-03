const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.products = [];
    this.nextId = 1;
    this.path = filePath;
  }

  async addProduct(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Todos los campos son obligatorios.");
    }

    const existingProduct = this.products.find((product) => product.code === code);
    if (existingProduct) {
      throw new Error(`El código '${code}' ya está asignado a otro producto.`);
    }

    const newProduct = {
      id: this.nextId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.nextId++;

    await this.saveToFile();
  }

  async getProducts() {
    await this.loadFromFile();
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      console.error("Not found");
    }
    return product;
  }

  async updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      throw new Error("Producto no encontrado");
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedFields,
      id,
    };

    await this.saveToFile();
  }

  async deleteProduct(id) {
    const updatedProducts = this.products.filter((product) => product.id !== id);
    if (updatedProducts.length === this.products.length) {
      throw new Error("Producto no encontrado");
    }

    this.products = updatedProducts;
    await this.saveToFile();
  }

  async loadFromFile() {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      this.products = JSON.parse(data);
      this.nextId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
    } catch (error) {
      this.products = [];
    }
  }

  async saveToFile() {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), "utf8");
    } catch (error) {
      console.error("Error al guardar los productos:", error);
    }
  }
}

module.exports = ProductManager;
