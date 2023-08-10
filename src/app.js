import express from 'express';
import {
    readFile
} from 'fs/promises';

const PORT = 8080;
const app = express();

app.use(express.json());

(async () => {
    const productsData = await readFile('products.json', 'utf-8');
    const products = JSON.parse(productsData);

    app.get('/', (req, res) => {
        res.send('Hola');
    });

    app.get('/products', (req, res) => {
        const {
            category,
            limit
        } = req.query;
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
    });

    app.get('/products/:id', (req, res) => {
        const prod = products.find(prod => prod.id === parseInt(req.params.id));
        if (prod) {
            res.status(200).send(prod);
        } else {
            res.status(404).send("Producto no existente");
        }
    });

    app.listen(PORT, () => {
        console.log(`Server on port ${PORT}`);
    });
})();