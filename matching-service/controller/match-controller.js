// import { isObjectIdOrHexString } from "mongoose";
import {
    ormCreateMatch as _createMatch,
    ormFindJoinableMatches as _findJoinableMatches,
    ormGetAllMatch as _getAllMatch,
    ormDeleteMatch as _deleteMatch,
    ormUpdateMatch as _updateMatch
} from "../model/match-orm.js";
import { io, httpServer } from "../index.js"
import moment from "moment";

export async function getAllMatch() {
    const allMatch = await _getAllMatch();
    console.log(allMatch)
}

export async function createMatch(params) {
    try {
        const { userOne, socketId, difficulty, createdAt } = params;
        if (userOne && difficulty && socketId && createdAt) {

            // create pending match for user
            const newMatch = await _createMatch(userOne, null, difficulty, socketId, null, createdAt, true);

            if (newMatch) {
                console.log("Created new pending match");
            } else {
                io.emit('error-match', { message: 'Could not create a new pending match!' });
                return;
            }

            // find a match for the pending match
            const match = await _findJoinableMatches(userOne, difficulty, createdAt);
            if (match) {
                // join match for both users
                console.log(`Found a match ${match.userOne} with socketId ${match.socketId} for difficulty ${match.difficulty} for user ${userOne}`)
                await _updateMatch(userOne, match, match.socketId, moment().format("YYYY-MM-DD HH:mm:ss"), false);

                // delete match's pending entry
                await _deleteMatch(match)

                // add to same room
                const addUserToRoom = await addToRoom(socketId, match.socketId, userOne, match);
                if (addUserToRoom) {
                    console.log(`Successfully add ${userOne} and ${match} to room!`);
                } else {
                    console.log(`Cannot add ${userOne} and ${match} to room!`);
                }
            } else {
                console.log(`No valid pending match in db for ${userOne}`);
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
    // emit event to userone and userTwo
    io.to(userOneSocketId).emit('matchSuccess', { roomId: roomName })
    io.to(userTwoSocketId).emit('matchSuccess', { roomId: roomName })
    return io.sockets.adapter.rooms.get(roomName).size == 2;
}


