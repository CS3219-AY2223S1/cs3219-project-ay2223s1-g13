import "./DifficultySelectorCard.css";

function DifficultySelectorCard({ difficulty, isSelected }) {
  return (
    <div
      className={`difficultycard_container${
        isSelected ? "_selected" : ""
      } difficultycard_button`}
    >
      <div className={"difficultycard_text"}>{difficulty}</div>
    </div>
  );
}

export default DifficultySelectorCard;
