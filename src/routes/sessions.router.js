import { Router } from "express";
import  passport  from "passport";
import { passportError, authorization } from "../utils/messageError.js";
import { login, register, logout } from "../controllers/sessions.controller.js";

const sessionRouter = Router()
sessionRouter.post('/register', passport.authenticate('register'), register)
sessionRouter.post('/login', passport.authenticate('login'), login)
sessionRouter.get('/logout', logout);
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
sessionRouter.get('/check-session', (req, res) => {
  const { user } = req;
  const responseData = { loggedIn: !!user };

  if (user) {
    responseData.user = {
      firstName: user.firstName,
      lastName: user.lastName,
      rol: user.rol
    };
  }

  res.json(responseData);
});

sessionRouter.get('/current', passportError('jwt'), authorization('user'), (req,res) =>{
  res.send(req.user)
})





export default sessionRouter
