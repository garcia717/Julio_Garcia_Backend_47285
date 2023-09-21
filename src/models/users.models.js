import mongoose, { Schema, model } from 'mongoose'

const userSchema = new Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        index: true
    },
    age: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    rol: {
        type: String,
        default: 'user'
    }
})

export const userModel = mongoose.model('Users', userSchema)