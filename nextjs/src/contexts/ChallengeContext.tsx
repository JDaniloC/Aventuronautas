import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { LevelUpModal } from '../components/LevelUpModal';
import { PopupModal } from '../components/PopupModal';
import Cookies from 'js-cookie';

interface challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengeContextData {
    level: number;
    nickname: string;
    currentExperience: number;
    challengesCompleted: number;
    experienceToNextLevel: number;
    activeChallenge: challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelModal: () => void;
    closeNewUser: (name: string) => void;
}

interface ChallengeProviderProps {
    children: ReactNode;
    level: number;
    nickname: string;
    currentExperience: number;
    challengesCompleted: number;
}

export const ChallengeContext = createContext({} as ChallengeContextData);

export function ChallengesProvider({ 
        children, ...rest 
    }: ChallengeProviderProps ) {
    const [level, setLevel] = useState(rest.level);
    const [nickname, setNickname] = useState(rest.nickname);
    const [currentExperience, setCurrentExperience] = useState(
        rest.currentExperience);
    const [challengesCompleted, setChallengesCompleted] = useState(
        rest.challengesCompleted);

    const [activeChallenge, setActiveChallenge] = useState(null);
    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        if (!Cookies.get("nickname")) {
            setIsNewUser(true);
        }

        Cookies.set("nickname", nickname);
        Cookies.set("level", String(level));
        Cookies.set("currentExperience", String(currentExperience));
        Cookies.set("challengesCompleted", String(challengesCompleted));
    }, [nickname, level, currentExperience, challengesCompleted]);

    useEffect(() => {
        Notification.requestPermission();
    }, []);

    function levelUp() {
        setLevel(level + 1);
        setIsLevelModalOpen(true);
    }

    function closeLevelModal() {
        setIsLevelModalOpen(false);
    }
    function closeNewUser(name: string) {
        setNickname(name)
        setIsNewUser(false);
    }

    function startNewChallenge() {
        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio 🎉', {
                body: `Valendo 10xp!`
            })
        } else {
            console.log("Não permitido")
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge(){
        if (!activeChallenge) {
            return;
        }

        const { amount } = activeChallenge;
        let finalExperience = currentExperience + amount;

        if (finalExperience > experienceToNextLevel) {
            finalExperience -= experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengeContext.Provider value = {{ 
            currentExperience, level, 
            experienceToNextLevel,
            challengesCompleted, 
            activeChallenge, 
            nickname, levelUp,
            resetChallenge,  
            startNewChallenge, 
            completeChallenge,
            closeLevelModal, closeNewUser }}>
            {children}

            { isNewUser && <PopupModal /> }
            { isLevelModalOpen && <LevelUpModal /> }
        </ChallengeContext.Provider>
    )
}