import { createMatch, findJoinableMatches } from "./repository.js";

export async function ormCreateMatch(userOne, userTwo, timeCreated, isFull) {
    try {
        await createMatch({ userOne, userTwo, timeCreated, isFull });
        return true;
    } catch (err) {
        console.log("ERROR: Could not create new match");
        return { err };
    }
}

export async function ormFindJoinableMatches(timeCreated) {
    try {
        const joinableMatches = await findJoinableMatches({ timeCreated });
        return joinableMatches;
    } catch (err) {
        console.log("ERROR: Could not find matches");
        return { err };
    }
}
