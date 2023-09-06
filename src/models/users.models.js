import {Schema, model} from 'mongoose'

const userSchema = new Schema({
    name: String,
    lastName: String,
    age: Number,
    email: {
        type: String,
        unique: true
    },
    password: String
})

export const userModel = model('Users', userSchema)
