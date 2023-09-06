import {Schema, model} from 'mongoose'

const cartSchema = new Schema({
    products: [{id_prod:{type: Schema.Types.ObjectId, ref:'Products', require: true}, quantity:{type: Number, require: true}}],
    default:[]

})

export const cartModel = model('Carts', cartSchema)

