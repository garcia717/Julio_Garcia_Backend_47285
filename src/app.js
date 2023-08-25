import express from 'express';
import http from 'http';
import path from 'path';
import exphbs from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js';
import { __dirname } from './path.js';
import { Server } from 'socket.io';
import ProductManager from './productManager.js';


const PORT = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server); 
export { io };
const productManager = new ProductManager('products.json');

const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  defaultLayout: 'main',
  extname: 'handlebars',

});


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/views', viewsRouter);
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Usuario conectado');
  
  socket.on('updateProducts', async () => {
    console.log('Evento updateProducts recibido en el servidor')
      try {
      const products = await productManager.getProducts(); 
      socket.emit('updatedProducts', products); 
      console.log('Productos actualizados enviados al cliente');
    } catch (error) {
      console.error('Error:', error);
    }
  });
});



app.get('/', (req, res) => {
  res.send('Hola');
});
app.get('/realtimeproducts', viewsRouter);
app.get('/home', viewsRouter);

server.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});