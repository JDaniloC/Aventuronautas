import { useContext, useState } from "react";
import { ChallengeContext } from "../contexts/ChallengeContext";
import styles from "../styles/components/Popup.module.css";

export function PopupModal() {
    const [name, setName] = useState("Tripulante");
    const { closeNewUser } = useContext(ChallengeContext);

    function closeModal() {
        closeNewUser(name)
    }

    return (
        <div className = {styles.overlay}>
            <div className = {styles.container}>
                <header> </header>

                <strong> Seja bem-vindo </strong>
                <p> Você está prestes a embarcar em uma aventura incrível </p>
                <p> Qual seu nome, tripulante? </p>

                <input type="text" value = {name} onChange = {
                    (evt) => setName(evt.target.value)}/>

                <button type = "button" onClick = {closeModal}>
                   Decolar!
                </button>
            </div>
        </div>
    )
}