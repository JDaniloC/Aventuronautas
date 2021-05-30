import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ChallengeContext } from './ChallengeContext';

interface CountContextData {
    verifyGain: (currentStep: number) => void;
    resetCount: () => void;
}

interface CountProviderProps {
    children: ReactNode;
    nextStep: () => void;
    setXpEarned: (newEarn: boolean[]) => void;
    xpEarned: boolean[];
}

export const CountContext = createContext({} as CountContextData);
let countdownTimeout: NodeJS.Timeout;

export function CountProvider({ 
        children, ...rest 
    }: CountProviderProps ) {

    const { earnXp } = useContext(ChallengeContext);

    const [ time, setTime ] = useState(0);

    useEffect(() => {
        countdownTimeout = setTimeout(() => {
            setTime(time + 1);
        }, 1000)
    }, [time])

    function resetCount() {
        console.log("Setando o tempo pra 0")
        clearTimeout(countdownTimeout);
        setTime(0);
        clearTimeout(countdownTimeout);
    }

    function verifyGain(currentStep:number) {
        let earned = rest.xpEarned;
        if (!rest.xpEarned[currentStep] && time >= 60) {
            switch (currentStep) {
                case 0:
                    earnXp(50);
                    break;
                case 1:
                    earnXp(150);
                    break;
            }
            earned[currentStep] = true;
            rest.setXpEarned(earned);
        } 
        resetCount();
        rest.nextStep();
    }


    return (
        <CountContext.Provider value = {{
            verifyGain, resetCount
         }}>
            {children}
        </CountContext.Provider>
    )
}