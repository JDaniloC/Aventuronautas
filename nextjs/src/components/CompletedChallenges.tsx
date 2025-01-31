import { AuthContext } from "../contexts/AuthContext";
import React, { useContext } from "react";

import styles from "../styles/components/CompletedChallenges.module.css";

export default function CompletedChallenges() {
  const { challengesCompleted } = useContext(AuthContext);

  return (
    <div className={styles.CompletedChallengesContainer}>
      <span> Missões completas </span>
      <span> {challengesCompleted} </span>
    </div>
  );
}
