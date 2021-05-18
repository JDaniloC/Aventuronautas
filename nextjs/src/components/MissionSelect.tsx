import { useContext, useEffect, useState } from 'react';
import { ChallengeContext } from '../contexts/ChallengeContext';
import styles from '../styles/components/MissionSelect.module.css';
import Link from 'next/link';

interface challenge {
    mission: number;
    title: string;
    icon: string;
    description: string;
}

export default function MissionSelect({ missions }) {
    const [ missionArray, setMissionArray ] = useState([] as challenge[]);
    const { challengesCompleted } = useContext(ChallengeContext);

    useEffect(() => {
        setMissionArray(missions);
    }, [])
    
    return (
        <div className = {styles.missionsContainer}>
            { (missionArray.length > 0) ? missionArray.map((task) => (
                <span key = {task.mission} className = {
                    ((challengesCompleted + 1) >= Number(task.mission) ?
                    styles.arrived : "")}>
                    <div className = {styles.imgDiv}>
                        <img src={task.icon}/>
                    </div>
                    <div className = { styles.description }>
                        <h3> {task.title} </h3>
                        <p> {task.description} </p>
                    </div>
                    <Link href = {`/missions/${task.mission}`}>
                        <button className = "project"
                            disabled = {challengesCompleted + 1 < task.mission}> 
                            Embarcar 
                        </button>
                    </Link>
                </span>
            )) : 
            <div className = "loadingDiv">
                <img src="/gifs/rocket.gif"/>
                <p> Carregando... </p>
            </div>}
        </div>
    );
}
