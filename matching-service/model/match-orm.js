import { createMatch, findMatch } from "./repository.js";

export async function ormCreateMatch(user1, user2, difficulty, createdAt, otherprops) {
    try {
        await createMatch({ user1, user2, difficulty, createdAt, otherprops });
        return true;
    } catch (err) {
        console.log("ERROR: Could not create new match");
        return { err };
    }
}

export async function ormFindMatch(user) {
    try {
        await findMatch(user.username);
        return true;
    } catch (err) {
        console.log("ERROR: Could not check for existing match");
        return { err };
    }
}
