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

  res.redirect('/', 302, { payload: req.user });
 
  } catch (error) {
    res.status(400).send({ error: `Error en Login: ${error}` });
  }
});

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
  res.status(200).send({ mensaje: 'Usuario registrado' })
})

sessionRouter.get('/githubCallback', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ mensaje: 'Usuario logueado' })
})

sessionRouter.get('/logout', (req, res) =>{
    if(req.session.loggedIn){
        req.session.destroy()
    }
    res.redirect('/', 302, { result:'Sesión terminada'});
})


sessionRouter.get('/check-session', async (req, res) => {
  try {
  
    if (req.session && req.session.loggedIn) {
      const { email} = req.session.user;
      const user = await userModel.findOne({ email: email});

      if (user) {      
        res.status(200).json({
          user,
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
