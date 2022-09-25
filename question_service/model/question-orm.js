import { createQuestion, findQuestion } from "./repository.js"

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

export async function ormFindQuestion(difficulty) {
    try {
        const question = await findQuestion(difficulty)
        return question;
    } catch (err) {
        console.log("ERROR: Database error");
        return { err };
    }
}