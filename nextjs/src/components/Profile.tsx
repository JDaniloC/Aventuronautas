import { useContext } from 'react';
import { ChallengeContext } from '../contexts/ChallengeContext';
import styles from '../styles/components/Profile.module.css';

export default function Profile() {
    const { nickname, level } = useContext(ChallengeContext);
    return (
        <div className = {styles.profileContainer}>
            <img src="icons/profile.png" alt="Profile img"/>
            <div>
                <strong> { nickname } </strong>
                <p> 
                    <img src="icons/level.svg" alt="level img"/>    
                    Level {level}
                </p>
            </div>
        </div>
    );
}
