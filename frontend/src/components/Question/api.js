import axios from "axios";
import { URL_QUESTION_SVC } from "../../configs";

export const fetchQuestion = async (difficulty) => {
    const res = await axios.get(URL_QUESTION_SVC, {
        params: { difficulty: difficulty },
    });
    const filtered = {
        title: res.data.question[0].title,
        body: res.data.question[0].body,
    };
    console.log("zx res: ", filtered)
    return filtered;
};
