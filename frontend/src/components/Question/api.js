import axios from "axios";
import { URL_ROOMQUESTION_SVC } from "../../configs";

export const fetchRoomQuestion = async (roomId) => {
    const res = await axios.get(URL_ROOMQUESTION_SVC, {
        params: { roomId: roomId },
    });
    return res.data;
};
