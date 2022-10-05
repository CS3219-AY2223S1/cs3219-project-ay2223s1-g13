import { createQuestion, findQuestion, createRoomQuestion, findRoomQuestion, deleteRoomQuestion } from "./repository.js"

export async function ormCreateQuestion(title, body, difficulty) {
    try {
        const newQuestion = await createQuestion({ title, body, difficulty });
        newQuestion.save(err => {
            if (err) console.log(err);
        });
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new question');
        return { err };
    }
}

export async function ormFindQuestion(difficulty) {
    try {
        const question = await findQuestion(difficulty);
        return question;
    } catch (err) {
        console.log("ERROR: Database error");
        return { err };
    }
}

export async function ormSetRoomQuestion(roomId, question) {
    try {
        const roomQuestion = await createRoomQuestion(roomId, question);
        roomQuestion.save(err => {
            if (err) console.log("shit");
        });
        return true;
    } catch (err) {
        console.log('ERROR: Could not bind question to room');
        return { err };
    }
}

export async function ormDeleteRoomQuestion(roomId) {
    try {
        await deleteRoomQuestion(roomId);
        return true;

    } catch (err) {
        console.log('ERROR: Could not delete room question');
        return { err };
    }
}

export async function ormFindRoomQuestion(roomId) {
    try {
        const roomQuestion = await findRoomQuestion(roomId);
        console.log("zx3 ", roomQuestion);
        if (roomQuestion) {
            return roomQuestion.question;
        }
        return false;
    } catch (err) {
        console.log('ERROR: Could not find room question');
        return { err };
    }
}

export async function removeRoomQuestion(roomId) {
    try {
        await deleteRoomQuestion(roomId);
        return true;
    } catch (err) {
        console.log('ERROR: Could not delete room question');
        return { err };
    }
}
