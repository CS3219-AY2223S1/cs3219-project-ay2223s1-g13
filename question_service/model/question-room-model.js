import mongoose from "mongoose";

var Schema = mongoose.Schema
let QuestionRoomModelSchema = new Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    question: [{
        type: Schema.Types.ObjectId,
        ref: 'QuestionModel',
        required: true,
    }]
})

export default mongoose.model('QuestionRoomModel', QuestionRoomModelSchema)