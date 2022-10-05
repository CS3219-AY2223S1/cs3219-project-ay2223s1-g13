import axios from "axios";
import { URL_QUESTION_SVC, URL_ROOMQUESTION_SVC } from "./configs.js";

export const fetchQuestion = async (difficulty) => {
    const res = await axios.get(URL_QUESTION_SVC, {
        params: { difficulty: difficulty },
    });
    return res.data;
};

export const createRoomQuestion = async (roomId, question) => {
    const res = await axios.post(URL_ROOMQUESTION_SVC, {
        roomId: roomId,
        question: question,
    });
    console.log(res);
    return res.data;
}