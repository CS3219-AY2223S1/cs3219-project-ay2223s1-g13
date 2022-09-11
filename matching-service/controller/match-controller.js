// import { isObjectIdOrHexString } from "mongoose";
import { ormCreateMatch as _createMatch } from "../model/match-orm";

const socket = io.connect();

// this part doesnt work basically index.js emits 'createMatch' after 
// it picks up event 'match' (sent thru postman socket.io) then we 
// need match controller to pick it up to call te createMatch func
socket.on('createMatch', (params) => {
    console.log("fkfkfk, ", params);
})

export async function createMatch(req, res) {
    try {
        const { userOne, userTwo, difficulty, socketId, createdAt } = req.body;
        if (userOne && userTwo && difficulty && socketId && createdAt) {
            const newMatch = await _createMatch(userOne, userTwo, difficulty, socketId, createdAt);


            if (newMatch) {
                return res.status(201).json({ message: "Created new match" });
            } else {
                return res
                    .status(400)
                    .json({ message: "Could not create a new match!" });
            }
        } else {
            return res.status(400).json({ message: "Missing args" });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Server error when creating match!" });
    }
}


