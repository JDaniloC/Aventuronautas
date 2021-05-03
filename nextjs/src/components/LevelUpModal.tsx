import { useContext } from "react";
import { ChallengeContext } from "../contexts/ChallengeContext";
import styles from "../styles/components/LevelUpModal.module.css";

export function LevelUpModal() {
    const { level, closeLevelModal } = useContext(ChallengeContext);

    return (
        <div className = {styles.overlay}>
            <div className = {styles.container}>
                <header> { level } </header>

                <strong> Parabéns </strong>
                <p> Você alcançou um novo nível. </p>

                <button type = "button" onClick = {closeLevelModal}>
                    <img src="/icons/close.svg" alt="Close modal"/>
                </button>
            </div>
        </div>
    )
}