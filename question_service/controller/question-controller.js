import {
    ormCreateQuestion as _createQuestion,
    ormFindQuestion as _findQuestion,
    ormFindRoomQuestion as _findRoomQuestion,
    ormSetRoomQuestion as _setRoomQuestion,
    ormDeleteRoomQuestion as _deleteRoomQuestion,
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
                    message: `Create the question ${title} successfully!`,
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

export async function findQuestion(req, res) {
    try {
        const { difficulty } = req.query;
        if (difficulty) {
            const question = await _findQuestion(difficulty);
            return res
                .status(202)
                .json({ message: "Found a question", question: question });

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

export async function createRoomQuestion(req, res) {
    try {
        console.log("FUCK: ", req.body);
        const { roomId, question } = req.body;
        if (roomId && question) {
            const resp = await _setRoomQuestion(roomId, question);
            if (resp.err) {
                return res
                    .status(400)
                    .json({ message: "Could not create/update a room question" });
            } else {
                return res.status(201).json({
                    message: `Create/Update the room question successfully for ${roomId}!`,
                });
            }
        } else {
            return res.status(400).json({
                message: "Missing roomId or question for the room",
            });
        }

    } catch {
        return res
            .status(500)
            .json({ message: "Server error when creating/updating a room question!" });
    }
}

export async function deleteRoomQuestion(res, req) {
    try {
        const { roomId } = req.body;
        if (roomId) {
            await _deleteRoomQuestion(roomId);
            return res
                .status(202)
                .json({ message: "Delete room question" });
        } else {
            return res.status(400).json({
                message: "RoomQuestion not found",
            });
        }
    } catch {
        return res
            .status(500)
            .json({ message: "Server error when deleting roomQuestion" });
    }
}

export async function fetchRoomQuestion(req, res) {
    try {
        const { roomId } = req.query;
        if (roomId) {
            const questions = await _findRoomQuestion(roomId);
            console.log("ZXXXXXX: ", questions);
            return res
                .status(202)
                .json({ message: "Retrieved questions for room", question: questions });
        } else {
            return res.status(400).json({
                message: "No valid roomId found",
            });
        }
    } catch {
        return res
            .status(500)
            .json({ message: "Server error when finding questions for room!" });
    }
}
