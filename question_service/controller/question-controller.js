import {
    ormCreateQuestion as _createQuestion,
    ormFindQuestions as _findQuestion,
    ormFindQuestionById as _findQuestionById,
    ormDeleteQuestionById as _deleteQuestionById,
} from "../model/question-orm.js";

export async function createQuestion(req, res) {
    try {
        const { title, body, difficulty } = req.body;
        if (title && body && difficulty) {
            const resp = await _createQuestion(title, body, difficulty);
            if (resp.err) {
                return res
                    .status(400)
                    .json({ message: "Could not create a new question" });
            } else {
                return res.status(201).json({
                    message: `Create the question ${title} succesfully!`,
                });
            }
        } else {
            return res
                .status(400)
                .json({ message: "Incomplete question format! " });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Database failure when creating new question" });
    }
}

export async function findQuestions(req, res) {
    try {
        const { difficulty } = req.query;
        if (difficulty) {
            const questions = await _findQuestion(difficulty);
            return res
                .status(202)
                .json({ message: "Found a question", questions: questions });
        } else {
            return res.status(400).json({
                message: "Enter the difficulty level for the problem",
            });
        }
    } catch {
        return res
            .status(500)
            .json({ message: "Server error when finding a question!" });
    }
}

export async function findQuestionById(req, res) {
    try {
        const { id } = req.query;
        if (id) {
            const question = await _findQuestionById(id);
            return res
                .status(202)
                .json({ message: "Found a question", question: question });
        } else {
            return res.status(400).json({
                message: "Provide Id of the question",
            });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Server error when finding a question!" });
    }
}

export async function deleteQuestionById(req, res) {
    try {
        const { id } = req.query;
        if(id) {
            const question = await _findQuestionById(id);
            if (!question) {
                return res.status(406).json({ message: "Question does not exist" });
            }

            const resp = await _deleteQuestionById(id);
            if (resp.err) {
                return res
                    .status(400)
                    .json({ message: "Could not delete the Question!" });
            } else {
                return res.status(200).json({
                    message: `Deleted Question ${id} successfully!`,
                });
            }
        } else {
            return res.status(400).json({ message: "Question id missing!" });
        }
    } catch {}
}
