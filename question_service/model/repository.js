import QuestionModel from "./question-model.js";
import "dotenv/config";

// Set up mongoose connection
import mongoose from "mongoose";

let mongoDB =
    process.env.ENV == "PROD"
        ? process.env.DB_CLOUD_URI
        : process.env.DB_LOCAL_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function createQuestion(params) {
    return new QuestionModel(params);
}

export async function findQuestions(difficulty) {
    return QuestionModel.aggregate([
        { $match: { difficulty: difficulty } },
        { $sample: { size: 2 } },
    ]);
}

export async function findQuestionId(id) {
    return QuestionModel.findById(id);
}

export async function deleteQuestion(id) {
    return QuestionModel.deleteOne({ _id: id });
}
