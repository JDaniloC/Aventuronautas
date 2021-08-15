import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/components/CompletedChallenges.module.css';

export default function CompletedChallenges() {
    const { challengesCompleted } = useContext(AuthContext);

    return (
        <div className = {styles.CompletedChallengesContainer}>
            <span> Missões completas </span>
            <span> {challengesCompleted} </span>
        </div>
    );
}
