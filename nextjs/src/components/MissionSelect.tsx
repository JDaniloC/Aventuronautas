import { AuthContext } from "../contexts/AuthContext";
import { TiArrowDownThick } from "react-icons/ti";
import React, { useContext, useEffect, useState } from "react";

import Link from "next/link";
import styles from "../styles/components/MissionSelect.module.css";

export interface Challenge {
  mission: number;
  title: string;
  icon: string;
  description: string;
}

export default function MissionSelect({
  missions,
}: Readonly<{ missions: Challenge[] }>) {
  const [missionArray, setMissionArray] = useState([] as Challenge[]);
  const { challengesCompleted } = useContext(AuthContext);

  function nextMission() {
    window.scrollTo(0, 350 + 190 * challengesCompleted);
  }

  useEffect(() => {
    setMissionArray(missions);
    if (window.innerWidth > 850) {
      setTimeout(nextMission, 1000);
    }
  }, []);

  return (
    <div className={styles.missionsContainer}>
      {missionArray.length > 0 ? (
        missionArray.map((task) => (
          <span
            key={task.mission}
            className={
              challengesCompleted + 1 >= Number(task.mission)
                ? styles.arrived
                : ""
            }
          >
            <div className={styles.imgDiv}>
              <img src={task.icon} alt="icon mission" />
            </div>
            <div className={styles.description}>
              <h3> {task.title} </h3>
              <p> {task.description} </p>
            </div>
            <Link href={`/missions/${task.mission}`}>
              <button
                className="project"
                type="button"
                disabled={challengesCompleted + 1 < task.mission}
              >
                Embarcar
              </button>
            </Link>
          </span>
        ))
      ) : (
        <div className="loadingDiv">
          <img src="/gifs/rocket.gif" alt="loading img" />
          <p> Carregando... </p>
        </div>
      )}
      {challengesCompleted < 12 ? (
        <button onClick={nextMission} type="button" className="project">
          Próxima missão &nbsp; <TiArrowDownThick />
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}
