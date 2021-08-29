import { AuthContext } from "../contexts/AuthContext";
import styles from "../styles/components/Popup.module.css";
import { FormEvent, useContext, useRef, useState } from "react";
import { BiArrowBack } from 'react-icons/bi';
import ImagePicker from 'react-image-picker';
import 'react-image-picker/dist/index.css'

export function PopupModal() {
    const [step, setStep] = useState("");
    const [msg, setMsg] = useState("Você já esteve aqui?");

    const [name, setName] = useState("");
    const [idade, setIdade] = useState(6);
    const { createNewUser, userExists } = useContext(AuthContext);
    const [image, setImage] = useState("/icons/profile.png");

    const profiles = [
        {"image": "/icons/profile.png"},
        {"image": "/icons/profile2.png"},
        {"image": "/icons/profile3.png"},
        {"image": "/icons/profile4.png"},
        {"image": "/icons/profile5.png"},
    ]

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
            createNewUser(name, idade, image);
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

    function onPick(selected:{ src:string, value:string }) {
        setImage(selected.value);
    }

    function handleChangeName(evt: FormEvent<EventTarget>) {
        const target = evt.target as HTMLInputElement;
        setName(target.value)
    }
    function handleChangeIdade(evt: FormEvent<EventTarget>) {
        const target = evt.target as HTMLInputElement;
        setIdade(Number(target.value))
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
                        <div className = {styles.image_picker}>
                            <ImagePicker
                                images = {profiles.map((award) => ({
                                    src: award.image, value: award.image}))}
                                onPick = {onPick}
                            />
                        </div>
                        <input type="text" value = {name} 
                            placeholder = "Nome Sobrenome" 
                            onChange = {handleChangeName}/>
                        <input type="number" placeholder = "Idade"
                            min = {5} max = {10} 
                            onChange = {handleChangeIdade}/>
                    </> : 
                        <input type="text" value = {name} 
                            placeholder = "Nome Sobrenome" 
                            onChange = {handleChangeName}/>}
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