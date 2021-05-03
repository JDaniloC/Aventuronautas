import { useContext } from 'react';
import { useRouter } from "next/router";
import { ChallengeContext } from '../contexts/ChallengeContext';
import challenges from "../../challenges.json";
import styles from '../styles/components/MissionSelect.module.css';

interface challenge {
    id: number;
    title: string;
    image: string;
    description: string;
}

export default function MissionSelect() {
    const router = useRouter();
    const missions: challenge[] = challenges as challenge[];

    const { challengesCompleted } = useContext(ChallengeContext);
    return (
        <div className = {styles.missionsContainer}>
            { missions.map((mission) => (
                <span>
                    <img src={mission.image}/>
                    <div>
                        <h3> {mission.id}. {mission.title} </h3>
                        <p> {mission.description} </p>
                    </div>
                    <button disabled = {challengesCompleted + 1 < mission.id}
                        onClick = {() => {
                            router.push(`/missions/${mission.id}`);
                        }}> 
                        Embarcar 
                    </button>
                </span>
            )) }
        </div>
    );
}
