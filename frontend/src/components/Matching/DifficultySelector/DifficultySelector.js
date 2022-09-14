import { useState } from "react";

import DifficultySelectorCard from "./DifficultySelectorCard";
import { difficulties } from "../../../constants";

import "./DifficultySelector.css";
function DifficultySelector() {
    const [selectedDifficulty, setSelectedDifficulty] = useState("");

    const onClickDifficulty = (clickedDifficulty) => {
        setSelectedDifficulty(clickedDifficulty);
    };

    return (
        <div classname="difficultySelector_container">
            <div className="difficultySelector_body">
                {difficulties.map((difficulty) => {
                    return (
                        <div
                            onClick={() => onClickDifficulty(difficulty)}
                            key={difficulty}
                        >
                            <DifficultySelectorCard
                                difficulty={difficulty}
                                isSelected={difficulty === selectedDifficulty}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DifficultySelector;
