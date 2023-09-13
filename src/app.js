import "dotenv/config"
import express from 'express';
import http from 'http';
import path from 'path';
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js';
import {  __dirname} from './path.js';
import {  Server} from 'socket.io';
import mongoose from 'mongoose'
import  {messageModel}  from './models/messages.models.js';
import { productModel } from './models/products.models.js';

mongoose.connect(process.env.MONGO_URL)
  .then(() => {console.log('BDD conectada')})
  .catch(() => console.log('Error en conexion a BDD'))

const PORT = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
export {
  io
};


const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  defaultLayout: 'main',
  extname: 'handlebars',
  allowedProtoProperties: true,
  allowProtoMethodsByDefault: true,
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))
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
      const products = await productModel.find().exec();
      io.emit('updatedProducts', products);
      console.log('Productos actualizados enviados al cliente');
    } catch (error) {
      console.error('Error:', error);
    }
  });
});

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('chatMessage', async (data) => {

    const message = new messageModel({
      email: data.user,
      message: data.message,
      postTime: data.postTime
    });

    try {
      await message.save();
    } catch (error) {
      console.error('Error al guardar el mensaje en MongoDB:', error);
    }

    io.emit('chatMessage', {
      user: message.email,  
      message: message.message,
      postTime: message.postTime
    });
  });

});



app.get('/', (req, res) => {
  res.send('Hola');
});
app.get('/realtimeproducts', viewsRouter);
app.get('/home', viewsRouter);
app.get('/chat', viewsRouter);

server.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

