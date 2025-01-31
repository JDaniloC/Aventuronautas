import { AuthContext } from "../contexts/AuthContext";
import { BiArrowBack } from "react-icons/bi";
import React, {
  FormEvent,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import ImagePicker from "react-image-picker";
import styles from "../styles/components/Popup.module.css";

import "react-image-picker/dist/index.css";

export function PopupModal() {
  const [step, setStep] = useState("");
  const [msg, setMsg] = useState("Você já esteve aqui?");

  const [name, setName] = useState("");
  const [idade, setIdade] = useState(6);
  const { createNewUser, userExists } = useContext(AuthContext);
  const [image, setImage] = useState("/icons/profile.png");

  const profiles = [
    { image: "/icons/profile.png" },
    { image: "/icons/profile2.png" },
    { image: "/icons/profile3.png" },
    { image: "/icons/profile4.png" },
    { image: "/icons/profile5.png" },
  ];

  const textErrorRef = useRef(null);
  const submitBtnRef = useRef(null);

  const handleFormLimitations = useCallback(() => {
    textErrorRef.current.style.color = "red";
    let msg = "Você já é grandinho de mais...";
    if (name === "") {
      msg = "Precisamos do seu nome!";
    }
    setMsg(msg);
  }, [name]);

  const verifyUser = useCallback(async () => {
    const hasUser = await userExists(name);
    if (hasUser) {
      setMsg("Este nome já existe!");
      textErrorRef.current.style.color = "red";
      submitBtnRef.current.disabled = false;
      return true;
    }
    return false;
  }, [name]);

  const handleSubmit = useCallback(async () => {
    if (name !== "" && idade <= 10) {
      let hasUser = false;
      if (step === "register") {
        setMsg("Qual seu nome, tripulante?");
        submitBtnRef.current.disabled = true;

        hasUser = await verifyUser();
      }
      if (!hasUser) {
        createNewUser(name, idade, image);
      }
    } else {
      handleFormLimitations();
    }
  }, [name, idade, image, step, createNewUser, userExists]);

  const handleRegister = useCallback(() => {
    setMsg("Qual seu nome, tripulante?");
    textErrorRef.current.style.color = "";
    setStep("register");
  }, []);

  const handleContinue = useCallback(() => {
    setMsg("Se identifique tripulante!");
    textErrorRef.current.style.color = "";
    setStep("login");
  }, []);

  const onPick = useCallback((selected: { src: string; value: string }) => {
    setImage(selected.value);
  }, []);

  const handleChangeIdade = useCallback((evt: FormEvent<EventTarget>) => {
    const target = evt.target as HTMLInputElement;
    setIdade(Number(target.value));
  }, []);

  const handleChangeName = useCallback((evt: FormEvent<EventTarget>) => {
    const target = evt.target as HTMLInputElement;
    setName(target.value);
  }, []);

  const handleBack = useCallback(() => {
    setMsg("Você já esteve aqui?");
    textErrorRef.current.style.color = "";
    setStep("");
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header> </header>

        <strong> Seja bem-vindo </strong>
        <p> Uma grande aventura te espera! </p>
        <p ref={textErrorRef}> {msg} </p>

        <div className={styles.inputs}>
          {step === "" ? (
            <div className={styles.buttons}>
              <button onClick={handleRegister} type="button">
                Minha primeira viagem
              </button>
              <button onClick={handleContinue} type="button">
                Continuar viagem
              </button>
            </div>
          ) : step === "register" ? (
            <>
              <div className={styles.image_picker}>
                <ImagePicker
                  images={profiles.map((award) => ({
                    src: award.image,
                    value: award.image,
                  }))}
                  onPick={onPick}
                />
              </div>
              <input
                type="text"
                value={name}
                placeholder="Nome Sobrenome"
                onChange={handleChangeName}
              />
              <input
                type="number"
                placeholder="Idade"
                min={5}
                max={10}
                onChange={handleChangeIdade}
              />
            </>
          ) : (
            <input
              type="text"
              value={name}
              placeholder="Nome Sobrenome"
              onChange={handleChangeName}
            />
          )}
        </div>

        {step !== "" ? (
          <div className={styles.startContainer}>
            <button onClick={handleBack} type="button">
              <BiArrowBack />
            </button>
            <button
              className="project start"
              ref={submitBtnRef}
              type="button"
              onClick={handleSubmit}
            >
              Decolar!
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
