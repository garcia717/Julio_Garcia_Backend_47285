import { Schema, model } from 'mongoose';

const messageSchema = new  Schema({
    email:{type: String, require: true},
    message: {type: String, require :true},
    postTime: {type: Date, default : Date.now}

})

export const messageModel = model('Messages', messageSchema)