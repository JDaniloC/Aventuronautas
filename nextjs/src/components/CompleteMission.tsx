import { ChallengeContext} from '../contexts/ChallengeContext';
import { useContext } from 'react';
import { useRouter } from "next/router";
import { CountContext } from '../contexts/CountContext';


export function NextStepButton({ currentStep }) {
    const { verifyGain } = useContext(CountContext);

    return (
        <button onClick = {() => {
            verifyGain(currentStep)
            }}>
            Próxima tarefa
        </button>
    )
}

export function CompleteMission({ missionID }) {
    const { challengesCompleted, completeChallenge } = useContext(ChallengeContext);
    const router = useRouter();

    function handleComplete() {
        if (challengesCompleted >= Number(missionID)) {
            router.push("/")
        } else {
            completeChallenge(100);
        }
    }

    return (
        <button onClick = { handleComplete }> 
            Completar missão 
        </button>
    )
}