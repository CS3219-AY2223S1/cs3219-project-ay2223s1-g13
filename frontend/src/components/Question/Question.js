import { useEffect, useState } from "react";
import { formatLinesToQuestion } from "../common/Formatter/Formatter";
import Section from "../common/Section/Section";
import { fetchQuestion } from "./api";

function Question() {
    const [selectedQuestion, setSelectedQuestion] = useState();
    const [difficulty, setDifficulty] = useState("Easy");

    useEffect(() => {
        const _fetchQuestion = async () => {
            const res = await fetchQuestion(difficulty);
            setSelectedQuestion(res.question[0]);
        };
        _fetchQuestion();
    }, []);
    return (
        <div className="question_container">
            {selectedQuestion && (
                <Section
                    title={selectedQuestion.title}
                    size={"M"}
                    subTitle={selectedQuestion.difficulty}
                    subTitleColor={
                        selectedQuestion.difficulty === "Hard"
                            ? "red"
                            : selectedQuestion.difficulty === "Medium"
                            ? "var(--yellow)"
                            : "var(--green)"
                    }
                >
                    <div>{formatLinesToQuestion(selectedQuestion.body)}</div>
                </Section>
            )}
        </div>
    );
}

export default Question;
