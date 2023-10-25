import { userModel } from "../models/users.models.js";

export const getUsers = async (req,res) =>{
    try {
        const users = await userModel.find()
        res.status(200).send({ respuesta: 'OK', mensaje: users })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar usuarios', mensaje: error })
    }
}

export const getUserByID = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (user) {
            res.status(200).send({ answer: 'OK', message: user })
        } else {
            res.status(404).send({ answer: 'Error en consultar usuario', message: 'User not Found' })
        }
    } catch (error) {
        res.status(400).send({ answer: 'Error en consultar usuario', message: error })
    }
}

export const postUser = async (req, res) => {
    const { firstName, lastName, age, email, password } = req.body
    try {
        const respuesta = await userModel.create({ firstName, lastName, age, email, password })
        res.redirect('/login');
        res.status(200).send({ answer: 'OK', message: answer })

    } catch (error) {
        res.status(400).send({ answer: 'Error en crear usuario', message: error })
    }
}

export const editUser = async (req, res) => {
    const { id } = req.params
    const { nombre, apellido, edad, email, password } = req.body
    try {
        const user = await userModel.findByIdAndUpdate(id, { firstName, lastName, age, email, password })
        if (user) {
            res.status(200).send({ answer: 'OK', message: user })
        } else {
            res.status(404).send({ answer: 'Error en actualizar usuario', message: 'User not Found' })
        }
    } catch (error) {
        res.status(400).send({ answer: 'Error en actualizar usuario', message: error })
    }
}

export const deteleUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findByIdAndDelete(id)
        if (user) {
            res.status(200).send({ answer: 'OK', message: user })
        } else {
            res.status(404).send({ answer: 'Error en eliminar usuario', message: 'User not Found' })
        }
    } catch (error) {
        res.status(400).send({ answer: 'Error en eliminar usuario', message: error })
    }
}