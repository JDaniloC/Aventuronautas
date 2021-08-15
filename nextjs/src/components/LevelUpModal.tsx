import styles from "../styles/components/LevelUpModal.module.css";
import { AuthContext } from "../contexts/AuthContext";
import { AiOutlineClose } from 'react-icons/ai';
import { useContext } from "react";

export function LevelUpModal() {
    const { level, closeLevelModal } = useContext(AuthContext);

    return (
        <div className = {styles.overlay}>
            <div className = {styles.container}>
                <header> { level } </header>

                <strong> Parabéns </strong>
                <p> Você alcançou um novo nível. </p>
                
                <button type = "button" onClick = {closeLevelModal}>
                    <AiOutlineClose size = {25}/>
                </button>
            </div>
        </div>
    )
}