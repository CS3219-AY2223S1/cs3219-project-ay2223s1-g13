import mongoose from "mongoose";

var Schema = mongoose.Schema;
const HistoryModelSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    matchedUsername: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    questionId: {
        type: Schema.Types.ObjectId,
        required: true,
    }
});

export default mongoose.model("HistoryModel", HistoryModelSchema);
