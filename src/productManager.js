import { promises as fs } from 'fs';

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.nextId = 1;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            this.nextId = Math.max(...this.products.map(product => product.id), 0) + 1;
        } catch (error) {
            this.products = [];
            this.nextId = 1;
        }
    }

     async saveProducts() {
         await fs.writeFile(this.path, JSON.stringify(this.products), 'utf-8');
     }

    async addProduct(productData) {
        const {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category
        } = productData;

        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
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
            category,
        };

        this.products.push(newProduct);
        this.nextId++;
         await this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        if (!product) {
            console.error("Producto no encontrado.");
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        const index = this.products.findIndex((product) => product.id === id);
        if (index === -1) {
            throw new Error(`Producto con id '${id}' no encontrado.`);
        }

        this.products[index] = {
            ...this.products[index],
            ...updatedFields
        };
         await this.saveProducts();
    }

    async deleteProduct(id) {
        const index = this.products.findIndex((product) => product.id === id);
        const path = './products.json'
        if (index === -1) {
            throw new Error(`Producto con id '${id}' no encontrado.`);
        }

        this.products.splice(index, 1);
        await fs.appendFile(path, JSON.stringify(this.products.filter(prod => prod.id != id)))
        await fs.writeFile(path, JSON.stringify(this.products.filter(prod => prod.id != id)));
    }
}




export default  ProductManager ;