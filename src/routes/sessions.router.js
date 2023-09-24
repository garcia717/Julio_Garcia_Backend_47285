import { Router } from "express";
import { userModel } from "../models/users.models.js";


const sessionRouter = Router()

sessionRouter.post('/register', async (req, res) => {
  const { firstName, lastName, age, email, password } = req.body;
  try {
    const newUser = new userModel({
      firstName,
      lastName,
      age,
      email,
      password,
    });
    await newUser.save();
    res.redirect('/', 300, { info: 'user' });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.redirect('/', 404, { info: 'user' });
  }
});

sessionRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!req.session) {
      res.status(500).send({ resultado: 'Error de sesión' });
      return;
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
    res.status(400).send({ error: `Error en Login: ${error}` });
  }
});



sessionRouter.get('/logout', (req, res) =>{
    if(req.session.login){
        req.session.destroy()
    }
    res.redirect('/', 300, { result:'Sesión terminada'});
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
