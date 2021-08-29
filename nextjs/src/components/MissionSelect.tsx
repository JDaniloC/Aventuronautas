import styles from '../styles/components/MissionSelect.module.css';
import { AuthContext } from '../contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { TiArrowDownThick } from 'react-icons/ti';
import Link from 'next/link';

interface challenge {
    mission: number;
    title: string;
    icon: string;
    description: string;
}

export default function MissionSelect(
    { missions }: { missions: challenge[] }) {
    const [ missionArray, setMissionArray ] = useState([] as challenge[]);
    const { challengesCompleted } = useContext(AuthContext);

    useEffect(() => {
        setMissionArray(missions);
        if (window.innerWidth > 850) {
            setTimeout(nextMission, 1000);
        }
    }, [])
    
    function nextMission() {
        window.scrollTo(0, 350 + (190 * (13 - challengesCompleted)))
    }

    return (
        <div className = {styles.missionsContainer}>
            { (missionArray.length > 0) ? missionArray.map((task) => (
                <span key = {task.mission} className = {
                    ((challengesCompleted + 1) >= Number(task.mission) ?
                        styles.arrived : "")}>
                    <div className = {styles.imgDiv}>
                        <img src={task.icon} alt = "icon mission"/>
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
                <img src="/gifs/rocket.gif" alt = "loading img"/>
                <p> Carregando... </p>
            </div>}
            {(challengesCompleted < 12) ? 
                <button onClick = {nextMission} 
                    className = "project">
                    Próxima missão &nbsp; <TiArrowDownThick />
                </button>: 
            <></>}
        </div>
    );
}
