import {Schema, model} from 'mongoose'

const cartSchema = new Schema({
    products: [{
        id_prod: {
            type: Schema.Types.ObjectId,
            ref: 'Products',
            require: true
        },
        quantity: {
            type: Number,
            require: true
        }
    }],


})

cartSchema.pre('findOne', function(){
    this.populate('products.id_prod')
})

export const cartModel = model('Carts', cartSchema)