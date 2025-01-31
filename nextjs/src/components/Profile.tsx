import { AuthContext } from "../contexts/AuthContext";
import { FaQuestion } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import React, { useContext, useState } from "react";

import Help from "./Help";
import Cookies from "js-cookie";
import styles from "../styles/components/Profile.module.css";

export default function Profile() {
  const { nickname, level, image } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  function exitAccount() {
    Cookies.remove("nickname");
    location.reload();
  }

  function showHelp() {
    setShowModal(true);
  }

  function hideHelp() {
    setShowModal(false);
  }

  return (
    <>
      <div className={styles.profileContainer}>
        <img src={image} alt="Profile img" />
        <div>
          <strong> {nickname} </strong>
          <p>
            <img src="icons/level.svg" alt="level img" />
            Level {level}
          </p>
        </div>
        <button onClick={showHelp} type="button">
          <FaQuestion />
        </button>
        <button onClick={exitAccount} type="button">
          <ImExit />
        </button>
      </div>
      <div
        role="button"
        tabIndex={-1}
        onClick={hideHelp}
        onKeyDown={hideHelp}
        className={styles.overlay}
        style={{ display: showModal ? "flex" : "none" }}
      >
        <Help />
      </div>
    </>
  );
}
