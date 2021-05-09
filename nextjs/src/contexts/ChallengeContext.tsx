import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { LevelUpModal } from '../components/LevelUpModal';
import { PopupModal } from '../components/PopupModal';
import Cookies from 'js-cookie';

interface ChallengeContextData {
    level: number;
    nickname: string;
    currentExperience: number;
    challengesCompleted: number;
    experienceToNextLevel: number;
    levelUp: () => void;
    completeChallenge: (amount:number) => void;
    closeLevelModal: () => void;
    closeNewUser: (name: string) => void;
    earnXp: (amount:number) => void;
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

    function earnXp(amount: number) {
        let finalExperience = currentExperience + amount;

        if (finalExperience > experienceToNextLevel) {
            finalExperience -= experienceToNextLevel;
            levelUp();
        }
        
        setCurrentExperience(finalExperience);
    }

    function completeChallenge(amount: number) {
        earnXp(amount);
        new Audio('/notification.mp3').play();
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengeContext.Provider value = {{ 
            currentExperience, level, 
            experienceToNextLevel,
            challengesCompleted, 
            nickname, levelUp,
            completeChallenge,
            closeLevelModal, 
            closeNewUser,
            earnXp }}>
            {children}

            { isNewUser && <PopupModal /> }
            { isLevelModalOpen && <LevelUpModal /> }
        </ChallengeContext.Provider>
    )
}