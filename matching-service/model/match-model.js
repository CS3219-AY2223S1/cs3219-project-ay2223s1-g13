import mongoose from 'mongoose';
import UserModel from '../../user-service/model/user-model';

var Schema = mongoose.Schema
let MatchModelSchema = new Schema({
    user: {
        type: UserModel,
        required: true,
        unique: true
    },
    timeCreated: {
        type: Date,
        default: Date.now(),
        required: true
    },
    isMatched: false
})

export default mongoose.model('MatchModel', MatchModelSchema)