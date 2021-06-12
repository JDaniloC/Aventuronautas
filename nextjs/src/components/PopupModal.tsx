import { ChallengeContext } from "../contexts/ChallengeContext";
import styles from "../styles/components/Popup.module.css";
import { useContext, useRef, useState } from "react";
import { BiArrowBack } from 'react-icons/Bi';

export function PopupModal() {
    const [step, setStep] = useState("");
    const [msg, setMsg] = useState("Você já esteve aqui?");

    const [name, setName] = useState("");
    const [idade, setIdade] = useState(6);
    const { closeNewUser, userExists } = useContext(ChallengeContext);

    const errorRef = useRef(null);
    const btnRef = useRef(null);

    async function closeModal() {
        if (name !== "" && idade <= 10) {
            if (step === "register") {
                setMsg("Qual seu nome, tripulante?");
                btnRef.current.disabled = true;

                const hasUser = await userExists(name);
                if (hasUser) {
                    setMsg("Este nome já existe!");
                    errorRef.current.style.color = "red";
                    btnRef.current.disabled = false;
                    return;
                }
            }
            closeNewUser(name, idade)
        } else {
            errorRef.current.style.color = "red";
            let msg = "Você já é grandinho de mais...";
            if (name === "") {
                msg = "Precisamos do seu nome!";
            }
            setMsg(msg);
        }
    }

    function handleRegister() {
        setMsg("Qual seu nome, tripulante?");
        errorRef.current.style.color = "";
        setStep("register");
    }
    
    function handleContinue() {
        setMsg("Se identifique tripulante!");
        errorRef.current.style.color = "";
        setStep("login");
    }

    function handleBack() {
        setMsg("Você já esteve aqui?");
        errorRef.current.style.color = "";
        setStep("")
    }

    return (
        <div className = {styles.overlay}>
            <div className = {styles.container}>
                <header> </header>

                <strong> Seja bem-vindo </strong>
                <p> Uma grande aventura te espera! </p>
                <p ref = {errorRef}> {msg} </p>

                <div className = {styles.inputs}>
                    {(step === "") ? <div className = {styles.buttons}>
                        <button onClick = {handleRegister}>
                            Minha primeira viagem 
                        </button>                        
                        <button onClick = {handleContinue}> 
                            Continuar viagem 
                        </button>                        
                    </div> : (step === "register") ? <>
                        <input type="text" value = {name} 
                            placeholder = "Nome Sobrenome" onChange = {
                            (evt) => setName(evt.target.value)}/>
                        <input type="number" placeholder = "Idade"
                            min = {5} max = {10} onChange = {
                            (evt) => setIdade(Number(evt.target.value))}/>
                    </> : 
                        <input type="text" value = {name} 
                            placeholder = "Nome Sobrenome" onChange = {
                            (evt) => setName(evt.target.value)}/> }
                </div>
                
                {(step !== "") ? <div className = {styles.startContainer}>
                    <button onClick = {handleBack}> 
                        <BiArrowBack/> 
                    </button>
                    <button className = "project start" ref = {btnRef}
                        type = "button" onClick = {closeModal}>
                        Decolar!
                    </button>
                </div> : <></>}
            </div>
        </div>
    )
}