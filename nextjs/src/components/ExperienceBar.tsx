import { AuthContext } from "../contexts/AuthContext";
import React, { useContext } from "react";

import styles from "../styles/components/ExperienceBar.module.css";

export default function ExperienceBar() {
  const { currentExperience, experienceToNextLevel } = useContext(AuthContext);

  const percentToNextLevel = Math.round(
    (currentExperience * 100) / experienceToNextLevel,
  );

  return (
    <header className={styles.experienceBar}>
      <span> 0 xp </span>
      <div>
        <div style={{ width: `${percentToNextLevel}%` }}> </div>

        <span
          className={styles.currentExperience}
          style={{ left: `${percentToNextLevel}%` }}
        >
          {currentExperience} xp
        </span>
      </div>
      <span> {experienceToNextLevel} xp </span>
    </header>
  );
}
