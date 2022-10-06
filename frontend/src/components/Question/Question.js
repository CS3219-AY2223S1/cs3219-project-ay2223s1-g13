import { useEffect, useState } from "react";
import { formatLinesToQuestion } from "../common/Formatter/Formatter";
import Section from "../common/Section/Section";
import { fetchQuestion } from "./api";

function Question({ title, body }) {
    const [selectedQuestion, setSelectedQuestion] = useState({});
    const [difficulty, setDifficulty] = useState(sessionStorage.getItem("difficulty"));

    useEffect(() => {
        // const _fetchQuestion = async () => {
        //     const res = await fetchQuestion(difficulty);
        //     setSelectedQuestion(res.question[0]);
        // };
        // _fetchQuestion();
        // setSelectedQuestion(props.val);
        console.log("zx : ", body);
        console.log(sessionStorage.getItem("difficulty"));
    }, []);
    return (
        <div className="question_container">
            {selectedQuestion && (
                <Section
                    // title={selectedQuestion.title}
                    title={title}
                    size={"M"}
                    // subTitle={selectedQuestion.difficulty}
                    subTitle={difficulty}
                    subTitleColor={
                        difficulty === "Hard"
                            ? "red"
                            : difficulty === "Medium"
                                ? "var(--yellow)"
                                : "var(--green)"
                    }
                >
                    <div>{formatLinesToQuestion(body)}</div>
                </Section>
            )}
        </div>
    );
}

export default Question;
