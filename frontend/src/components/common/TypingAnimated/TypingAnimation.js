import { useEffect, useState } from "react";
import "./TypingAnimation.css";

const Phase = {
    Typing: "Typing",
    Pausing: "Pausing",
    Deleting: "Deleting",
};

const TYPING_INTERVAL_MAX = 120;
const TYPING_INTERVAL_MIN = 40;

const TypyingAnimation = ({ strings }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [phase, setPhase] = useState(Phase.Typing);
    const [typedString, setTypedString] = useState("");

    const getTypingSpeed = () => {
        return (
            Math.floor(
                Math.random() * (TYPING_INTERVAL_MAX - TYPING_INTERVAL_MIN + 1)
            ) + TYPING_INTERVAL_MIN
        );
    };

    useEffect(() => {
        if (phase === Phase.Pausing) {
            const timeout = setTimeout(() => {
                setPhase(Phase.Deleting);
            }, 1000);

            return () => clearTimeout(timeout);
        }
        if (phase === Phase.Typing) {
            const nextTypedString = strings[selectedIndex].slice(
                0,
                typedString.length + 1
            );
            if (nextTypedString === typedString) {
                setPhase(Phase.Pausing);
                return;
            }

            const timeout = setTimeout(() => {
                setTypedString(nextTypedString);
            }, getTypingSpeed());

            return () => clearTimeout(timeout);
        }

        if (phase === Phase.Deleting) {
            if (!typedString) {
                const nextIndex = (selectedIndex + 1) % strings.length;
                setSelectedIndex(nextIndex);
                setPhase(Phase.Typing);
                return;
            }

            const nextTypedString = strings[selectedIndex].slice(
                0,
                typedString.length - 1
            );
            const timeout = setTimeout(() => {
                setTypedString(nextTypedString);
            }, 50);

            return () => clearTimeout(timeout);
        }
    }, [typedString, strings, phase, selectedIndex]);

    return <div className="blinking-cursor">{typedString}</div>;
};

export default TypyingAnimation;
