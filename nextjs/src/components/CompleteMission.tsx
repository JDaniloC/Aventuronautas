import { CountContext } from '../contexts/CountContext';
import { useContext, useEffect } from 'react';
import Link from 'next/link';


export function NextStepButton(
    { currentStep }: { currentStep: number}) {    
    const { verifyGain, resetCount } = useContext(CountContext);

    useEffect(() => {
        if (currentStep === 2) {
            resetCount()
        }
    }, [currentStep]);    

    function handleNextTask() {
        verifyGain(currentStep)
    }

    return (
        (currentStep === 2) ?
        <Link href = "/">
            <button className = "project"> 
                Completar missão
            </button>
        </Link>
        :
        <button className = "project" 
            onClick = {handleNextTask}>
            Próxima tarefa
        </button>
    )
}
