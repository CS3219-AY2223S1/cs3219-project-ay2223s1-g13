import axios from "axios";
import { URL_QUESTION_SVC } from "../../configs";

export const fetchQuestion = async (difficulty) => {
    const res = await axios.get(URL_QUESTION_SVC, {
        params: { difficulty: difficulty },
    });
    console.log(res);
    return res.data;
};
