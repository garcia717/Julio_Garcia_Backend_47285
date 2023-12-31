import "dotenv/config"
import express from 'express';
import http from 'http';
import path from 'path';
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import sessionRouter from "./routes/sessions.router.js";
import viewsRouter from './routes/views.router.js';
import userRouter from "./routes/users.router.js";
import {  __dirname} from './path.js';
import {  Server} from 'socket.io';
import mongoose from 'mongoose';
import  {messageModel}  from './models/messages.models.js';
import { productModel } from './models/products.models.js';
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from 'cors'
import nodemailer from'nodemailer'

mongoose.connect(process.env.MONGO_URL)
  .then(() => {console.log('BDD conectada')})
  .catch(() => console.log('Error en conexion a BDD'))


const whiteList = ['http://127.0.0.1:5173', 'http://127.0.0.1:8080', 'http://localhost:8080/login']  
const corsOptions ={
  origin: function(origin,callback){
    if(whiteList.indexOf(origin) != -1 || !origin){
      callback(null, true)
    }else{
      callback(new Error("Acceso denegado"))
    }
  }
}
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

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', userRouter)
app.use('/views', viewsRouter);
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 600,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize())
app.use(passport.session({secret:process.env.SIGNED_COOKIE, resave: true, saveUninitialized:true}))
initializePassport(passport)
app.use(sessionRouter) 

io.on('connection', (socket) => { 
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



app.get('/', viewsRouter);
app.get('/realtimeproducts', viewsRouter);
app.get('/login', viewsRouter);
app.get('/home', viewsRouter);
app.get('/chat', viewsRouter);

let transporter =nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 465, 
  secure: true, 
  auth:{
    user:'garcia717@gmail.com', 
    pass: process.env.PASSWORD_EMAIL, 
    AUTHMETHOD: 'LOGIN'}
})
app.get('/mail', async(req,res)=>{
  await transporter.sendMail({
    from: 'TEST MAIL garcia717@gmail.com',
    to: 'garcia717@gmail.com',
    subject:'Business Propossal',
    html:
         `<div>
            <h1>Prince James Nimka</h1>
          </div>`,
    atachements:{
      filename:'NigerianScam.jpg',
      path: __dirname + '/bills/NigerianScam.jpg',
      cid:'NigerianScam.jpg',
    }
  })

  res.send('mail enviado')
})

server.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});



