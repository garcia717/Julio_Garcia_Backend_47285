import express from 'express';
import {readFile} from 'fs/promises';

const PORT = 8080;
const app = express();

app.use(express.json());

let products = [];

(async () => {
    const productsData = await readFile('products.json', 'utf-8');
    products = JSON.parse(productsData);
})();

app.get('/', (req, res) => {
    res.send('Hola');
});

app.get('/products', async (req, res) => {
    try {
        const { category, limit } = req.query;
        let prods = [...products];

        if (category) {
            prods = prods.filter(prod => prod.category === category);
        }

        if (limit) {
            const limitValue = parseInt(limit);
            if (!isNaN(limitValue) && limitValue > 0) {
                prods = prods.slice(0, limitValue);
            }
        }

        res.status(200).send(prods);
    } catch (error) {
        res.status(500).send("Error al obtener los productos");
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const prod = products.find(prod => prod.id === productId);

        if (prod) {
            res.status(200).send(prod);
        } else {
            res.status(404).send("Producto no existente");
        }
    } catch (error) {
        res.status(500).send("Error al obtener el producto");
    }
});

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});