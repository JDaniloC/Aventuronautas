import { CountContext } from '../contexts/CountContext';
import { useContext, useEffect } from 'react';
import Link from 'next/link';


export function NextStepButton({ currentStep }) {    
    const { verifyGain, resetCount } = useContext(CountContext);

    useEffect(() => {
        if (currentStep === 2) {
            resetCount()
        }
    }, [currentStep]);    

    return (
        (currentStep === 2) ?
        <Link href = "/">
            <button className = "project"> 
                Completar missão
            </button>
        </Link>
        :
        <button className = "project" 
            onClick = {() => { verifyGain(currentStep) }}>
            Próxima tarefa
        </button>
    )
}
