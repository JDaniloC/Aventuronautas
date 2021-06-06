import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { LevelUpModal } from '../components/LevelUpModal';
import { PopupModal } from '../components/PopupModal';
import Cookies from 'js-cookie';
import axios from 'axios';

interface ChallengeContextData {
    level: number;
    nickname: string;
    currentExperience: number;
    challengesCompleted: number;
    experienceToNextLevel: number;
    levelUp: () => void;
    saveUser: () => void;
    closeLevelModal: () => void;
    completeChallenge: (amount:number) => void;
    closeNewUser: (name: string) => void;
    earnXp: (amount:number) => void;
}

interface ChallengeProviderProps {
    children: ReactNode;
}

export const ChallengeContext = createContext({} as ChallengeContextData);

export function ChallengesProvider({ 
        children, ...rest 
    }: ChallengeProviderProps ) {
    const [level, setLevel] = useState(0);
    const [nickname, setNickname] = useState("Novato(a)");
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        const name = Cookies.get("nickname");
        if (name) {
            axios.get("/api/users/", 
                { params: { nickname: name } }
                ).then((response) => {
                const user = response.data.user; 
                updateUser(name, user);
            })
        }
    }, [])

    useEffect(() => {
        const cookieNickname = Cookies.get("nickname");
        if (!cookieNickname || (
            cookieNickname === nickname &&
            cookieNickname === "Novato(a)")) {
            setIsNewUser(true);
        }
        Cookies.set("nickname", nickname);
    }, [nickname]);

    function updateUser(name:string, user:any) {
        setNickname(name);
        setLevel(user.level);
        setCurrentExperience(user.currentExperience);
        setChallengesCompleted(user.challengesCompleted);
    }

    function levelUp() {
        setLevel(level + 1);
        setIsLevelModalOpen(true);
    }

    function closeLevelModal() {
        setIsLevelModalOpen(false);
    }
    function closeNewUser(name: string) {
        axios.post("/api/users/", { nickname: name }).then(
            (response) => { 
                const user = response.data.user; 
                updateUser(name, user);
            } 
        );
        setIsNewUser(false);
    }

    function earnXp(amount: number) {
        let finalExperience = currentExperience + amount;
        new Audio('/notification.mp3').play();

        if (finalExperience > experienceToNextLevel) {
            finalExperience -= experienceToNextLevel;
            levelUp();
        }
        
        setCurrentExperience(finalExperience); 
    }

    function completeChallenge(amount: number) {
        earnXp(amount);
        setChallengesCompleted(challengesCompleted + 1);
    }

    async function saveUser() {
        console.log(nickname, level, currentExperience)
        if (nickname === "Novato(a)") {
            return;
        }
        await axios.patch("/api/users/", {
            nickname, level, 
            currentExperience, 
            challengesCompleted
        })
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
            earnXp, saveUser }}>
            {children}

            { isNewUser && <PopupModal /> }
            { isLevelModalOpen && <LevelUpModal /> }
        </ChallengeContext.Provider>
    )
}