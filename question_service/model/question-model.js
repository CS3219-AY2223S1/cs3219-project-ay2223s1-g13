import mongoose from "mongoose";

var Schema = mongoose.Schema
let QuestionModelSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    body: {
        type: String,
        required: true,
    },
    difficulty:{
        type: String,
        required: true,
    }
})

export default mongoose.model('QuestionModel', QuestionModelSchema)