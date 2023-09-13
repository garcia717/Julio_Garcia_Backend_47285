import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    code: {
        type: String,
        unique: true,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model('Products', productSchema);