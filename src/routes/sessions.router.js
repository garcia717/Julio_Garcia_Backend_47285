import { Router } from "express";
import  passport  from "passport";
import { passportError, authorization } from "../utils/messageError.js";
import { userModel } from "../models/users.models.js";


const sessionRouter = Router()
sessionRouter.post('/register', passport.authenticate('register'), async (req, res) => {

  try {
      if (!req.user) {
          return res.status(400).send({ mensaje: "Usuario existente" })
      }

      res.redirect(302, '/')

  } catch (error) {
      res.status(500).send({ mensaje: `Error al registrar el usuario ${error}` })
  }

})

sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {

  try {
      if (!req.user) {
          return res.status(401, '/login').send({ mensaje: "Credenciales invalidas" })
      }

    if (req.session.login) {
      res.status(200).send({ resultado: 'Login ya existente' });
      return;
    }

    const user = await userModel.findOne({ email: email });

    if (user) {
      if (user.password === password) {
        req.session.login = true;
        res.redirect('/', 300, { info: 'user' });
      } else {
        res.status(401).send({ resultado: 'Contaseña invalida', message: password });
      }
    } else {
      res.status(404).send({ resultado: 'Not Found', message: user });
    }
  } catch (error) {
      res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` })
  }

})

sessionRouter.get('/github', passport.authenticate('github'), async (req, res) =>{
  req.session.user = req.user
  res.redirect(301, '/static')
})

sessionRouter.get('/githubCallback', passport.authenticate('github', {failureRedirect: '/login', scope: ['user:email']}), async (req, res) =>{
  req.session.user = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      email: req.user.email,
  }
  res.redirect(302, '/')
})

sessionRouter.get('/logout', (req, res) =>{
    if(req.session.login){
        req.session.destroy()
    }
    res.clearCookie('jwtCookie')
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
