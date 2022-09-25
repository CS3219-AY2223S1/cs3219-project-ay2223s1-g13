import { ormCreateQuestion as _createQuestion, ormFindQuestion as _findQuestion } from "../model/question-orm";


export async function createQuestion(req, res) {
    try {
        const { title, body, difficulty } = req.body;
        if( title && body && difficulty ) {
            const resp = await _createQuestion(title, body, difficulty)
            if(resp.err) {
                return res.status(400).json({ message: 'Could not create a new question'})
            } else {
                return res.status(201).json({ message: `Create the question ${title} succesfully!`})
            }
        } else {
            return res.status(400).json({ message: "Incomplete question format! "})
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database failure when creating new question'})
    }
}

export async function findQuestion(req, res) {
    try {
        const {difficulty} = req.body;
        if(difficulty) {
            const question = await _findQuestion(difficulty);
            return res.status(202).json({message: "Found a question", question: question})
        } else {
            return res.status(400).json({ message: "Enter the difficulty level for the problem"})
        }
    } catch {
        return res.status(500).json({ message: "Server error when finding a question!" })
    }
}