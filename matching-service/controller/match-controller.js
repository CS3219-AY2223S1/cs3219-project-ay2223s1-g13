import {
    ormCreateMatch as _createMatch,
    ormFindJoinableMatches as _findJoinableMatches,
    ormGetAllMatch as _getAllMatch,
    ormDeleteMatch as _deleteMatch,
    ormFindMatch as _findMatch
    // ormUpdateMatch as _updateMatch
} from "../model/match-orm.js";
import { io, users } from "../index.js"
import moment from "moment";

export async function getAllMatch() {
    const allMatch = await _getAllMatch();
    console.log(allMatch)
}

export async function createMatch(params) {
    try {
        const { userOne, difficulty, socketIdOne } = params;
        if (userOne && difficulty && socketIdOne) {

            // create pending match for user
            console.log('Creating match for ', userOne);
            const newMatch = await _createMatch(userOne, null, difficulty, socketIdOne, null);

            if (!newMatch) {
                io.emit('error-match', { message: 'Could not create a new pending match!' });
                return;
            }
            const match = await _findJoinableMatches(userOne, socketIdOne, difficulty);
            // if there is a valid match, both userOne and the match's records is updated with each other's username and socketId
            if (match) {
                // join match for both users
                console.log(`Found a match ${match.userOne} with socketId ${match.socketIdOne} for difficulty ${match.difficulty} for user ${userOne}`)

                // add to same room
                const roomName = getRoomName(userOne, match.userOne);
                const addUserToRoom = await addToRoom(socketIdOne, match.socketIdOne, roomName);
                if (addUserToRoom) {
                    console.log(`Successfully add ${userOne} and ${match.userOne} to room!`);
                } else {
                    console.log(`Cannot add ${userOne} and ${match.userOne} to room!`);
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

// async function findMatch(params) {
//     try {
//         const { userOne, difficulty, socketId, createdAt } = req.body;
//         if (userOne && difficulty && socketId && createdAt) {
//             const validMatch = await _findJoinableMatches(req.body);

//             if (validMatch) {
//                 //join room for user and match
//                 return res.status(201).json({ message: "Found a match" });
//             } else {
//                 return res.status(400).json({ message: "Could not find a match!" });
//             }
//         } else {
//             return res.status(400).json({ message: "Missing args" })
//         }
//     } catch (err) {
//         return res.status(500).json({ message: "Server error when finding match!" })
//     }
// }

function getRoomName(userOne, userTwo) {
    const roomname = userOne + "_" + userTwo;
    return roomname;
}

async function addToRoom(userOneSocketId, userTwoSocketId, roomName) {
    const userOne = users.filter(user => user.socketId == userOneSocketId);
    const userTwo = users.filter(user => user.socketId == userTwoSocketId);
    const socketOne = userOne[0]["socket"];
    const socketTwo = userTwo[0]["socket"];
    socketOne.join(roomName);
    socketTwo.join(roomName);
    // emit event to userone and userTwo
    io.to(userOneSocketId).emit('matchSuccess', { roomId: roomName })
    io.to(userTwoSocketId).emit('matchSuccess', { roomId: roomName })
    return io.sockets.adapter.rooms.get(roomName).size == 2;
}

export async function deleteMatch(params) {
    try {
        const { user } = params;
        _deleteMatch(user)
    } catch (err) {
        io.emit('error-server', { message: 'Server error when deleting match' })
        return;
    }
}
