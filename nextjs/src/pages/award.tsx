import CompletedChallenges from '../components/CompletedChallenges';
import { ChallengeContext } from '../contexts/ChallengeContext';
import ExperienceBar from '../components/ExperienceBar'
import { Question } from '../components/Task/Models';
import Profile from '../components/Profile'
import Task from '../components/Task';


import styles from "../styles/pages/Home.module.css";
import 'react-image-picker/dist/index.css'
import { GiPodium } from 'react-icons/gi';
import { serverURL } from '../config';

import { useContext, useEffect, useState } from 'react';
import ImagePicker from 'react-image-picker';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

interface User {
    nickname: string;
    level: number;
    idade: number;
    image: string;
    reward: string;
    currentExperience: number;
    challengesCompleted: number;
}

interface Award {
    name: string;
    image: string;
}
interface AwardProps {
    finalTest: Question[];
    awards: Award[],
    users: User[],
}

function Infos() {
    return (<>
        <h1> Qual será sua recompensa? </h1>
        <p> 
            Se você completou todas as 14 missões e é um dos finalistas, 
            você pode escolher um destes prêmios! Mas antes, você precisa 
            passar por um último testem no qual só tem <b>uma</b> chance!
        </p>
        
        <h1> Quando irei receber? </h1>
        <p> 
            Ao clicar no botão de receber prêmio, você está solicitando 
            que o clube de aventureiros vá na sua casa entregar o prêmio. 
            Lembrando que você só tem até o início de <b>setembro</b> para 
            terminar as missões!
        </p>
        
        <h1> Como posso estar entre os primeiros? </h1>
        <p> 
            Complete todas as missões com calma (nós sabemos se você 
            leu/assistiu ou não) para ganhar xp, e responda todos os 
            formulários (ou apresente sua revista respondida).
        </p>
    </>)
}

function Podium({ users }) {
    function getScore(user: User) {
        const result = user.challengesCompleted * 200 +
                    (user.level - 1) * 100 - 
                    (user.idade - 6) * 50 +
                    user.currentExperience;

        return (result > 0) ? result : 0;
    }

    return (<div className = {styles.rankingContainer}>
        <div className = {styles.ranking}>
            <span> Codinome </span>
            <span> Missões </span>
            <span> Pontuação </span>
        </div>
        {users.sort((a, b) => { 
            return getScore(b) - getScore(a);
        }).map((user) => 
            <div key = {user.nickname}
                className = {styles.ranking}>
                <span>
                    {user.nickname}
                </span>
                <span>
                    {user.challengesCompleted}
                </span>
                <span>
                    {getScore(user)}
                </span>
            </div>
        )}
    </div>)
}

export default function Award(props: AwardProps) {  
    const [showPod, setShowPod] = useState(false);
    const [showTask, setShowTask] = useState(false);

    const [awards, setAwards] = useState([]);
    const [selected, setSelected] = useState("");

    const { reward, setReward, nickname, 
        completeChallenge, challengesCompleted 
    } = useContext(ChallengeContext);

    useEffect(() => {
        setAwards(props.awards);
        setSelected(reward);
    }, [])

    function onPick(selected:{ src:string, value:number }) {
        const awardName = awards[selected.value]?.name;
        setSelected(awardName);
        setReward(awardName);
    }

    function _toggleShowPod() { setShowPod(!showPod) }
    function _startTest() { setShowTask(true) }
    function _finishTest(score: number) {
        completeChallenge(score * 2);
        setShowTask(false);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title> Recompensa | Aventura Espacial </title>
            </Head>

            <ExperienceBar />
            
            <section>
                <Profile />
                <CompletedChallenges />
            </section>
            
            {(showTask) ? 
                <Task 
                    quests = {props.finalTest}
                    finishFunc = {_finishTest}
                    username = {nickname} />
            : <> 
            <section className = {styles.reward} >
                <div>
                    <button onClick = {_toggleShowPod}
                        className = {styles.floatBtn}>
                        <GiPodium size = {25} />
                    </button>
                    
                    {(!showPod) ? <Infos/> :
                    <Podium users = {props.users}/>}

                </div>
                <div className = {styles.picker}>
                    {selected ? 
                        <h3> Você selecionou {selected} </h3>
                    :<></>}
                    <ImagePicker
                        images = {awards?.map((award, i) => ({
                            src: award.image, value: i}))}
                        onPick = {onPick}
                    />
                </div>
            </section>
            
            <section>
                <Link href = "/">
                    <button className = "project">
                        Voltar
                    </button>
                </Link>
                <button className = "project" 
                    onClick = {_startTest}
                    disabled = {challengesCompleted < 14}
                    style = {{ marginBottom: "2em"}}> 
                    Iniciar teste 
                </button>
            </section>
            </>}
        </div>
    )
}

export const getStaticProps:GetStaticProps = async (context) => {
    const { data: userCollection } = await axios.get(
        serverURL + "/api/users/").catch((err) => {
            console.error(err);
            return { data: { users: [] } }
        })
    
    const { data: awardCollection } = await axios.get(
        serverURL + "/api/awards/").catch((err) => {
            console.error(err);
            return { data: { awards: [] } }
        })
    
    const testData = { data: { mission: 15 } };
    const { data: testCollection } = await axios.get(
        serverURL + "/api/questions/", testData).catch(err => {
            console.error(err);
            return { data: [] }
        })

    const awards = awardCollection.awards as Award[];
    const users = userCollection.users as User[];

    return {
        props: {
            users: users,
            awards: awards,
            finalTest: testCollection
        },
        revalidate: 60
    }
}