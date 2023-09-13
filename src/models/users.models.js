import {Schema, model} from 'mongoose'

const userSchema = new Schema({
    name: {type: String, require: true},
    lastName: {type: String, index: true},
    age: {type: Number, require: true},
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {type: String, require: true}
})

export const userModel = model('Users', userSchema)
