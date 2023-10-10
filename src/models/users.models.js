import mongoose, { Schema, model } from 'mongoose';
import { cartModel } from '../models/carts.models.js';
import mongoosePaginate from 'mongoose-paginate-v2';

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
    }, 
    cart:{
        type: Schema.Types.ObjectId, 
        ref: 'Carts'

    }
})

userSchema.plugin(mongoosePaginate)
userSchema.pre('save', async function(next){
    try{
        const newCart = await cartModel.create({products: []})
        this.cart = newCart._id
    }catch{
        next(error)
    }
})
export const userModel = mongoose.model('Users', userSchema)