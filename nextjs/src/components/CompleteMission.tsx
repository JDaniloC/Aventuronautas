import { ChallengeContext} from '../contexts/ChallengeContext';
import { CountContext } from '../contexts/CountContext';
import { useContext } from 'react';
import Link from 'next/link';


export function NextStepButton({ currentStep }) {
    const { verifyGain } = useContext(CountContext);

    return (
        <button className = "project" 
            onClick = {() => {verifyGain(currentStep)}}>
            Próxima tarefa
        </button>
    )
}

export function CompleteMission({ missionID }) {
    const { saveUser,
        challengesCompleted, 
        completeChallenge
    } = useContext(ChallengeContext);

    const { resetCount } = useContext(CountContext);

    return (
        <>
        {(challengesCompleted >= Number(missionID)) ? 
        <Link href = "/">
            <button className = "project" 
                onClick = { () => { resetCount(); saveUser(); } }> 
                Completar missão 
            </button>
        </Link>
        : <button className = "project" 
            onClick = { () => { resetCount(); completeChallenge(100); } }> 
            Receber recompensa!
        </button>}
    </>
    )
}