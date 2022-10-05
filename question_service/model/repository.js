import QuestionModel from "./question-model.js";
import QuestionRoomModel from "./question-room-model.js";
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

export async function findQuestion(difficulty) {
    return QuestionModel.aggregate([
        { $match: { difficulty: difficulty } },
        { $sample: { size: 1 } },
    ]);
}

export async function createRoomQuestion(roomId, question) {
    const existRoomQuestion = await QuestionRoomModel.findOne({ roomId: roomId }).populate('question');
    console.log("existRoomQues ", existRoomQuestion);
    if (existRoomQuestion) {
        return QuestionRoomModel.updateOne({ roomId: roomId },
            {
                $push: {
                    question: question
                }
            });
    } else {
        const roomQuestion = new QuestionRoomModel({
            roomId: roomId
        })
        roomQuestion.question.push(question);
        await roomQuestion.save();
        return roomQuestion;
    }
}

export async function deleteRoomQuestion(roomId) {
    await QuestionRoomModel.deleteOne({ roomId: roomId }, (err) => {
        if (err) {
            return { err };
        }
    });
}

export async function findRoomQuestion(roomId) {
    await QuestionRoomModel.findOne({ roomId: roomId })
        .populate('question')
        .exec((err, roomQuestion) => {
            console.log("sigh ", roomQuestion);
            if (err) {
                return { err };
            }
            return roomQuestion;
        });
}

