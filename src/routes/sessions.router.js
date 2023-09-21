import { Router } from "express";
import { userModel } from "../models/users.models.js";


const sessionRouter = Router()

sessionRouter.post('/register', (req, res) => {
    
  });

sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      
      const user = await userModel.findOne({ email: email });
  
      if (user) {
        if (user.password === password) {
          
          if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            user.rol = 'admin';
          } else {
            user.rol = 'user';
          }
  
          
          req.session.login = true;
          req.session.user = user;
          res.redirect('/products');
        } else {
          res.status(401).send({ result: 'Contraseña incorrecta' });
        }
      } else {
        res.status(404).send({ result: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(400).send({ error: `Error en login: ${error}` });
    }
  });

sessionRouter.get('/logout', (req, res) =>{
    if(req.session.login){
        req.session.destroy()
    }
    res.status(200).send({result:'Sesión terminada', message: user})
})


export default sessionRouter
