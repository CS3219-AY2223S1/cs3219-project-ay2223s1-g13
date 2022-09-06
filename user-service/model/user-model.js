import mongoose from 'mongoose';

var Schema = mongoose.Schema
let UserModelSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    password: {
        type: String,
        required: true,
    }, 
    token: { 
        type: String 
    }
})

export default mongoose.model('UserModel', UserModelSchema)
