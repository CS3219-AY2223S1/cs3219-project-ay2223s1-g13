import { where } from "sequelize";
import { MatchModel } from "./match-model.js";
import { createMatch, findJoinableMatches, getAllMatch, deleteMatch, updateMatch } from "./repository.js";

export async function ormCreateMatch(userOne, userTwo, difficulty, socketIdOne, socketIdTwo) {
    try {
        await createMatch({ userOne, userTwo, difficulty, socketIdOne, socketIdTwo });
        return true;
    } catch (err) {
        console.log("ERROR: Could not create new match ", err);
        return { err };
    }
}

export async function ormGetAllMatch() {
    try {
        const allMatch = await getAllMatch();
        return allMatch;
    } catch (err) {
        console.log("ERROR: Could not get all match");
        return { err }
    }
}

export async function ormFindMatch(userOne, socketIdOne) {
    try {
        await findMatch(userOne, socketIdOne);
        return true;
    } catch (err) {
        console.log("ERROR: Could not check for existing match");
        return { err }
    }
}

export async function ormFindJoinableMatches(userOne, socketIdOne, difficulty) {
    try {
        const match = await findJoinableMatches(userOne, socketIdOne, difficulty);

        if (match) {
            await updateMatch(userOne, match);
            return match;
        }
        return false;
    } catch (err) {
        console.log("ERROR: Could not find matches");
        return { err };
    }
}

export async function ormDeleteMatch(user) {
    try {
        await deleteMatch(user);
        return true;
    } catch (err) {
        console.log("ERROR: Could not delete match");
        return { err };
    }
}

// export async function ormUpdateMatch(userOne, userTwo, userTwoSocketId, createdAt, isPending) {
//     try {
//         await updateMatch(userOne, userTwo, userTwoSocketId, createdAt, isPending);
//         return true;
//     } catch (err) {
//         console.log("ERROR: Could not update match");
//         return { err };
//     }
// }
