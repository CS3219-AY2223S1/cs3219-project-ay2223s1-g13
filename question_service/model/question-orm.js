import { isValidObjectId } from "mongoose";
import {
    createQuestion,
    findQuestions,
    findQuestionId,
    deleteQuestion,
} from "./repository.js";

export async function ormCreateQuestion(title, body, difficulty) {
    try {
        const newQuestion = await createQuestion({ title, body, difficulty });
        newQuestion.save((err) => {
            if (err) console.log(err);
        });
        return true;
    } catch (err) {
        console.log("ERROR: Could not create new question");
        return { err };
    }
}

export async function ormFindQuestions(difficulty) {
    try {
        const questions = await findQuestions(difficulty);
        return questions;
    } catch (err) {
        console.log("ERROR: Database error");
        return { err };
    }
}

export async function ormFindQuestionById(id) {
    try {
        if (isValidObjectId(id)) {
            const question = await findQuestionId(id);
            return question;
        }
        return;
    } catch (err) {
        console.log("ERROR: Database error");
        return { err };
    }
}

export async function ormDeleteQuestionById(id) {
    try {
        if (isValidObjectId(id)) {
            await deleteQuestion(id);
            return true;
        }
        return;
    } catch (err) {
        console.log("ERROR: Database error");
        return { err };
    }
}
