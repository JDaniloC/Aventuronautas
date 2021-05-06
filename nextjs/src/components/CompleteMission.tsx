import { useContext, useState } from 'react';
import { ChallengeContext} from '../contexts/ChallengeContext';

export default function CompleteMission() {
    const { completeChallenge } = useContext(ChallengeContext);
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <button className = "completeBtn"
        onClick = {() => {
            completeChallenge(100);
            setIsDisabled(true);
        }} disabled = {isDisabled}> 
            Completar missão 
        </button>
    )
}