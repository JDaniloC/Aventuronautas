import { useContext } from 'react';
import { ChallengeContext } from '../contexts/ChallengeContext';
import styles from '../styles/components/CompletedChallenges.module.css';

export default function CompletedChallenges() {
    const { challengesCompleted } = useContext(ChallengeContext);

    return (
        <div className = {styles.CompletedChallengesContainer}>
            <span> Missões completas </span>
            <span> {challengesCompleted} </span>
        </div>
    );
}
