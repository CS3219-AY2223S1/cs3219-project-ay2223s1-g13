import { createMatch, findJoinableMatches } from "./repository.js";

export async function ormCreateMatch(userOne, userTwo, difficulty, socketIdOne, socketIdTwo, createdAt, isPending) {
    try {
        await createMatch({ userOne, userTwo, difficulty, socketIdOne, socketIdTwo, createdAt, isPending });
        return true;
    } catch (err) {
        console.log("ERROR: Could not create new match ", err);
        return { err };
    }
}

export async function ormFindMatch(user) {
    try {
        await findMatch(user.username);
        return true;
    } catch (err) {
        console.log("ERROR: Could not check for existing match");
        return { err }
    }
}

export async function ormFindJoinableMatches(difficulty, createdAt) {
    try {
        const joinableMatches = await findJoinableMatches(difficulty, createdAt);
        if (joinableMatches.length > 0) {
            return joinableMatches;
        }
        return false;
    } catch (err) {
        console.log("ERROR: Could not find matches");
        return { err };
    }
}
