class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1;
    }

    addProduct(productData) {
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
            console.error("Not found");
        }
        return product;
    }
}


module.exports = ProductManager;


