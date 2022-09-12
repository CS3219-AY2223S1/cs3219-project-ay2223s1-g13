// import { isObjectIdOrHexString } from "mongoose";
import { ormCreateMatch as _createMatch, ormFindJoinableMatches as _findJoinableMatches } from "../model/match-orm.js";
import { io, httpServer } from "../index.js"


export async function createMatch(params) {
    try {
        const { userOne, socketId, difficulty, createdAt } = params;
        if (userOne && difficulty && socketId && createdAt) {
            const match = await _findJoinableMatches(difficulty, createdAt);
            console.log(match)
            if (match) {
                console.log("match was found")
                // create a match
                await _createMatch(userOne, match, difficulty, userOneSocketId, userTwoSocketId, Date.now(), false);

                // remove record for userTwo 'match'?

                // add both user to a room
                const addUserToRoom = await addToRoom(userOneSocketId, userTwoSocketId, userOne, match);
                if (addUserToRoom) {
                    console.log(`Successfully add ${userOne} and ${match} to room!`);
                    return;
                }
                console.log(`Matched ${userOne} and ${match}`);
                return;
            }
            const newMatch = await _createMatch(userOne, null, difficulty, socketId, null, Date.now(), true);

            if (newMatch) {
                console.log("Created new pending match");
                return;
                // findmatch
            } else {
                io.emit('error-match', { message: 'Could not create a new pending match!' });
                return;
            }
        } else {
            io.emit('missing-args', { message: 'missing args' });
            return;
        }
    } catch (err) {
        io.emit('error-server', { message: 'Server error when creating match' })
        return;
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


