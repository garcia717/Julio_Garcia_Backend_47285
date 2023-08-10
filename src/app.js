import express from 'express'
import { readFile } from 'fs/promises';


const PORT = 8080
const app = express()
const productsData = await readFile('products.json', 'utf-8');
const products = JSON.parse(productsData);
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hola')
})

app.get('/products', (req, res) => {
    const {category} = req.query
    if (category) {
        const prods = products.filter(prod => prod.category === category)
        res.status(200).send(prods)
    }
    res.status(200).send(products)
})



app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})