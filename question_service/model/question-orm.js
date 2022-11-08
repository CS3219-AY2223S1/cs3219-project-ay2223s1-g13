import { createQuestion, findQuestions, findQuestionId, deleteQuestion } from "./repository.js"

export async function ormCreateQuestion(title, body, difficulty) {
    try {
        const newQuestion = await createQuestion({title,body,difficulty});
        newQuestion.save(err => {
            if (err) console.log(err);
        });
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new question');
        return { err };
    }
}

export async function ormFindQuestions(difficulty) {
    try {
        const questions = await findQuestions(difficulty)
        return questions;
    } catch (err) {
        console.log("ERROR: Database error");
        return { err };
    }
}

export async function ormFindQuestionById(id) {
    try {
        const question = await findQuestionId(id)
        return question;
    } catch (err) {
        console.log("ERROR: Database error");
        return { err };
    }
}

export async function ormDeleteQuestionById(id) {
    try {
        await deleteQuestion(id);
        return true;
    } catch (err) {
        console.log("ERROR: Database error");
        return { err };
    }
}