import axios from "axios";
import { URL_GET_ID_QUESTION } from "../../configs";

export const fetchQuestion = async (id) => {
    const res = await axios.get(URL_GET_ID_QUESTION+`?id=${id}`);
    const filtered = {
        title: res.data.question.title,
        body: res.data.question.body,
        id: res.data.question._id
    };
    return filtered;
};
