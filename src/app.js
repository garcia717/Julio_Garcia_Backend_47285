import express from 'express';
import {readFile} from 'fs/promises';
import productRouter  from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';


const PORT = 8080;
const app = express();

app.use(express.json());

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.get('/', (req, res) => {
  res.send('Hola');
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});