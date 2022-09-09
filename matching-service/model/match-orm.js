import { createMatch } from "./repository.js";

export async function ormCreateMatch(user1, user2, createdAt, otherprops) {
    try {
        await createMatch({ user1, user2, createdAt, otherprops });
        return true;
    } catch (err) {
        console.log("ERROR: Could not create new match");
        return { err };
    }
}
