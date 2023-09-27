import { Router } from "express";
import { userModel } from "../models/users.models.js";
import  passport  from "passport";


const sessionRouter = Router()

sessionRouter.post('/register',  passport.authenticate('register'), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send({ mensaje: "Usuario ya existente" })
  }

    res.redirect('/', 302, { mensaje: 'Usuario registrado' });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.redirect('/', 404, { mensaje: `Error al registrar usuario ${error}` });
  }
});

sessionRouter.post('/login', passport.authenticate('login'),async (req, res) => {


  try {
    if (!req.user) {
      return res.status(400).send({ mensaje: "Usuario invalido" })
  }

  req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email
  }

  res.redirect('/', 302, { payload: req.user });
 
  } catch (error) {
    res.status(400).send({ error: `Error en Login: ${error}` });
  }
});



sessionRouter.get('/logout', (req, res) =>{
    if(req.session.login){
        req.session.destroy()
    }
    res.redirect('/', 302, { result:'Sesión terminada'});
})


sessionRouter.get('/check-session', async (req, res) => {
  try {
  
    if (req.session && req.session.login) {
      const { email} = req.body;
      const user = await userModel.findOne({ email: email});

      if (user) {
        const userData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          rol: user.rol
        };
      
        res.status(200).json({
          user: userData,
          loggedIn: true 
          
          
        });
      } else {
        res.status(200).json({ loggedIn: true });
      } } else {

      res.status(200).json({ loggedIn: false });
    }
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




export default sessionRouter
