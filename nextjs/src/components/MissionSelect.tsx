import { useContext, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { ChallengeContext } from '../contexts/ChallengeContext';
import styles from '../styles/components/MissionSelect.module.css';
import axios from 'axios';

interface challenge {
    mission: number;
    title: string;
    icon: string;
    description: string;
}

export default function MissionSelect() {
    const router = useRouter();
    const [ missionArray, setMissionArray ] = useState([] as challenge[]);
    const { challengesCompleted } = useContext(ChallengeContext);

    useEffect(() => {
        axios.get("/api/missions/").then((response) => {
            const missionArray = response.data;
            if (missionArray.missions) {
                setMissionArray(missionArray.missions);
            }
        })
    }, [])
    
    return (
        <div className = {styles.missionsContainer}>
            { (missionArray.length > 0) ? missionArray.map((task) => (
                <span key = {task.mission}>
                    <div className = {styles.imgDiv}>
                        <img src={task.icon}/>
                    </div>
                    <div>
                        <h3> {task.mission}. {task.title} </h3>
                        <p> {task.description} </p>
                    </div>
                    <button 
                        disabled = {challengesCompleted + 1 < task.mission}
                        onClick = {() => {
                            router.push(`/missions/${task.mission}`);
                        }}> 
                        Embarcar 
                    </button>
                </span>
            )) : <p> Carregando... </p>}
        </div>
    );
}
