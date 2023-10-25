import {generateToken}  from "../utils/jwt.js";


export const login = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401, '/login').send({ mensaje: "Credenciales invalidas" })
        }
  
        req.session.user = {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            age: req.user.age,
            email: req.user.email,
        }
        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
          maxAge: 43200000,
        })
        res.redirect(302, '/')
  
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` })
    }
}

export const register = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: "Usuario existente" })
        }
  
        res.redirect(302, '/')
  
    } catch (error) {
        res.status(500).send({ mensaje: `Error al registrar el usuario ${error}` })
    }
}

export const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
          console.error('Error al destruir la sesión:', err);
        }
        res.clearCookie('jwtCookie');
        res.redirect(302, '/');
      })
}


