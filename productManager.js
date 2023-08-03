const fs = require("fs");

class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.nextId = 1;
        this.path = filePath;
    }
    async loadFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, "utf8");
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                // Si hay productos, calculamos el siguiente ID como el máximo + 1
                this.nextId = Math.max(...this.products.map((product) => product.id)) + 1;
            } else {
                // Si no hay productos, reiniciamos el ID a 1
                this.nextId = 1;
            }
        } catch (error) {
            this.products = [];
            this.nextId = 1;
        }
    }

    async saveToFile() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, data, "utf8");
        } catch (error) {
            throw new Error("Error al guardar en el archivo.");
        }
    }

    async addProduct(productData) {
        const {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        } = productData;
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
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        if (!product) {
            throw new Error("Not found");
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        const product = this.getProductById(id);
        Object.assign(product, updatedFields);
    }

    async deleteProduct(id) {
        const index = this.products.findIndex((product) => product.id === id);
        if (index === -1) {
            throw new Error("Producto no encontrado");
        }

        this.products.splice(index, 1);
    }

}


module.exports = ProductManager;