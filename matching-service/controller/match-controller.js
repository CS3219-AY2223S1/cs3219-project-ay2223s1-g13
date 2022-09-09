import { ormCreateMatch as _createMatch } from "../model/match-orm";

export async function createMatch(req, res) {
    try {
        const { userOne, userTwo, difficulty, socketId, createdAt } = req.body;
        const newMatch = _createMatch(userOne, userTwo, difficulty, socketId, createdAt);

        if (newMatch) {
            return res.status(201).json({ message: "Created new match" });
        } else {
            return res
                .status(400)
                .json({ message: "Could not create a new match!" });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Server error when creating match!" });
    }
}


