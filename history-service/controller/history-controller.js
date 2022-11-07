import {
    ormCreateHistory as _createHistory,
    ormGetHistories as _getHistories,
} from "../model/history-orm.js";

export async function createHistory(req, res) {
    try {
        const { username, matchedUsername, difficulty, question, questionId } = req.body;
        if (username && matchedUsername && difficulty && question && questionId) {
            const resp = await _createHistory(
                username,
                matchedUsername,
                difficulty,
                question,
                questionId
            );
            if (resp.err) {
                return res.status(400).json({
                    message: "Could not create a new history for the user",
                });
            } else {
                return res.status(201).json({
                    message: `Added in history of ${username} and ${matchedUsername}`,
                });
            }
        } else {
            return res
                .status(400)
                .json({ message: "Incomplete history format!" });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Database failure when creating a new history" });
    }
}

export async function getHistories(req, res) {
    try {
        const { username } = req.query;
        if (username) {
            const histories = await _getHistories(username);
            return res.status(202).json({
                message: `Found histories for ${username}`,
                history: histories,
            });
        } else {
            return res.status(400).json({
                message: "Missing Username",
            });
        }
    } catch {
        return res
            .status(500)
            .json({ message: "Server error when finding a question!" });
    }
}
