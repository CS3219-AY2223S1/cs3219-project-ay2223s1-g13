import { useEffect, useState } from "react";
import { formatLinesToQuestion } from "../common/Formatter/Formatter";
import Section from "../common/Section/Section";
import { fetchQuestion } from "./api";

function Question() {
    const [selectedQuestion, setSelectedQuestion] = useState();
    const [diffculty, setDifficulty] = useState("Easy");

    useEffect(() => {
        const _fetchQuestion = async () => {
            const res = await fetchQuestion(diffculty);
            setSelectedQuestion(res.question[0]);
        };
        _fetchQuestion();
    }, []);
    return (
        <div>
            {selectedQuestion && (
                <Section title={selectedQuestion.title} size={"M"}>
                    <div>{formatLinesToQuestion(selectedQuestion.body)}</div>
                </Section>
            )}
        </div>
    );
}

export default Question;
