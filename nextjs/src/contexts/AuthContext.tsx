import React, { 
    createContext, 
    ReactNode, 
    useEffect, 
    useState 
} from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

import { LevelUpModal } from '../components/LevelUpModal';
import { PopupModal } from '../components/PopupModal';
import { User } from 'models/user';

interface AuthContextData {
    currentExperience: number;
    challengesCompleted: number;
    idade: number; image: string;
    nickname: string; level: number;
    experienceToNextLevel: number;
    closeLevelModal: () => void;
    earnXp: (amount:number) => void;
    userExists: (name: string) => Promise<boolean>;
    levelUp: () => void; saveUser: () => void;
    completeChallenge: (amount:number) => void;
    createNewUser: (name: string, 
        number: number, image:string) => void;
}

interface ChallengeProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: ChallengeProviderProps ) {
    const [level, setLevel] = useState(0);
    const [idade, setIdade] = useState(6);
    const [nickname, setNickname] = useState("Novato(a)");
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);
    const [image, setImage] = useState("/icons/profile.png");

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        const name = Cookies.get("nickname");
        if (name) {
            axios.get("/api/users/", 
                { params: { nickname: name } }
            ).then((response) => {
                if (response.data.user) {
                    const user = response.data.user; 
                    updateUser(name, user);
                }
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

    async function userExists(name: string) {
        const response = await axios.get("/api/users/", 
            { params: { nickname: name } }
        );
        return response.data.user !== null;
    }

    function updateUser(name:string, user:User) {
        setNickname(name);
        setLevel(user.level);
        setImage(user.image);
        setIdade(user.idade);
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
    function createNewUser(name: string, idade:number, image:string) {
        axios.post("/api/users/", { nickname: name, idade, image }).then(
            (response) => { 
                const user = response.data.user; 
                updateUser(name, user);
            } 
        );
        setIsNewUser(false);
    }

    function earnXp(amount: number) {
        let finalExperience = currentExperience + amount;
        new Audio('/notification.mp3').play().then().catch();

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
        <AuthContext.Provider value = {{ 
            currentExperience, level, 
            nickname, image, idade,
            experienceToNextLevel,
            challengesCompleted, 
            createNewUser, 
            closeLevelModal, 
            completeChallenge,
            levelUp, userExists,
            earnXp, saveUser }}>
            {children}

            { isNewUser && <PopupModal /> }
            { isLevelModalOpen && <LevelUpModal /> }
        </AuthContext.Provider>
    )
}