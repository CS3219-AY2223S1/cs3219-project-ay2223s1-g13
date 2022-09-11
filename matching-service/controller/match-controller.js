// import { isObjectIdOrHexString } from "mongoose";
import { ormCreateMatch as _createMatch, ormFindJoinableMatches as _findJoinableMatches } from "../model/match-orm";
import { io } from "..";

const socket = io.connect();

// this part doesnt work basically index.js emits 'createMatch' after 
// it picks up event 'match' (sent thru postman socket.io) then we 
// need match controller to pick it up to call te createMatch func
socket.on('createMatch', (params) => {
    console.log("fkfkfk, ", params);
})



export async function createMatch(req, res) {
    try {
        const { userOne, difficulty, socketId, createdAt } = req.body;
        if (userOne && difficulty && socketId && createdAt) {

            const match = await _findJoinableMatches(difficulty, createdAt);

            if (match) {
                // create a match
                await _createMatch(userOne, match, difficulty, userOneSocketId, userTwoSocketId, Date.now(), false);

                // remove record for userTwo 'match'?

                // add both user to a room
                const addUserToRoom = await addToRoom(userOneSocketId, userTwoSocketId, userOne, match);
                if (addUserToRoom) {
                    return res.status(201).json({ message: `Successfully add ${userOne} and ${match} to room!` });
                }

                return res.status(201).json({ message: `Matched ${userOne} and ${match}` });
            }
            const newMatch = await _createMatch(userOne, null, difficulty, socketId, null, Date.now(), true);

            if (newMatch) {
                return res.status(201).json({ message: "Created new pending match" });
                // findmatch
            } else {
                return res
                    .status(400)
                    .json({ message: "Could not create a new pending match!" });
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

async function findMatch(params) {
    try {
        const { userOne, difficulty, socketId, createdAt } = req.body;
        if (userOne && difficulty && socketId && createdAt) {
            const validMatch = await _findJoinableMatches(req.body);

            if (validMatch) {
                //join room for user and match
                return res.status(201).json({ message: "Found a match" });
            } else {
                return res.status(400).json({ message: "Could not find a match!" });
            }
        } else {
            return res.status(400).json({ message: "Missing args" })
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error when finding match!" })
    }
}

async function getRoomName(userOne, userTwo) {
    return userOne + "_" + userTwo;
}

async function addToRoom(userOneSocketId, userTwoSocketId, userOne, userTwo) {
    const roomName = getRoomName(userOne, userTwo);
    const socketOne = io.sockets.sockets.get(userOneSocketId);
    const socketTwo = io.sockets.sockets.get(userTwoSocketId);
    socketOne.join(roomName);
    socketTwo.join(roomName);
    const size = io.sockets.adapter.rooms.get(roomName).size;
    return size == 2;
}


