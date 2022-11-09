import { useEffect, useState } from "react";
import { formatLinesToQuestion } from "../common/Formatter/Formatter";
import Section from "../common/Section/Section";
import { fetchQuestion } from "./api";

function Question({ title, body }) {
    const [selectedQuestion, setSelectedQuestion] = useState({});
    const [difficulty, setDifficulty] = useState(sessionStorage.getItem("difficulty"));

    useEffect(() => {
        console.log(sessionStorage.getItem("difficulty"));
    }, []);
    return (
        <div className="question_container">
            {selectedQuestion && (
                <Section
                    // title={selectedQuestion.title}
                    title={title}
                    width={"97.5%"}
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
