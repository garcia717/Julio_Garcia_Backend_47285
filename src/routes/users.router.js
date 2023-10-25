import { Router } from "express";
import { userModel } from "../models/users.models.js";
import {passportError, authorization} from '../utils/messageError.js'
import {getUsers, getUserByID, postUser, editUser, deteleUser} from '../controllers/users.controller.js'

const userRouter = Router()

userRouter.get('/', passportError('jwt'), authorization('admin'), getUsers)
userRouter.get('/:id', getUserByID)
userRouter.post('/', postUser)
userRouter.put('/:id', editUser)
userRouter.delete('/:id', deteleUser)

export default userRouter