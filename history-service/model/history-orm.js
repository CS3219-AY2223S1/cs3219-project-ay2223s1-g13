import { createHistory, getHistories } from "./repository";

export async function ormCreateHistory(username, matchedUsername, difficulty, question) {
    try {
        const newHistory = await createHistory({username, matchedUsername, difficulty, question});
        newHistory.save(err => {
            if (err) console.log(err);
        })
        return true;
    } catch (err) {
        console.log("ERROR: Could not create new history");
        return { err };
    }
}

export async function ormGetHistories(username) {
    try {
        const histories = await getHistories(username)
        return histories;
    } catch (err) {
        console.log("ERROR: Database error");
        return { err };
    }
}