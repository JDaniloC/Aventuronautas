import CompletedChallenges from '../components/CompletedChallenges';
import { ChallengeContext } from '../contexts/ChallengeContext';
import ExperienceBar from '../components/ExperienceBar'
import { Question } from '../components/Task/Models';
import Profile from '../components/Profile'
import Task from '../components/Task';


import styles from "../styles/pages/Home.module.css";
import 'react-image-picker/dist/index.css'
import { serverURL } from '../config';

import { useContext, useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

const TEST_COUNT = 10;

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
    users: User[],
}

function Infos() {
    return (<>
        <h1> Que página é essa? </h1>
        <p> 
            É feita para quem completou todas as 14 missões para que
            você possa gravar seu nome no espaço! Mas ainda existe um
            teste <b>extra</b> para verificar se você completou toda as
            missões sem trapacear, e você só tem uma chance para completar! 
        </p>
        
        <h1> Como ganhar pontos? </h1>
        <p> 
            Complete todas as missões com <b>calma</b> (ler a revista quando
            for pedido e assistir o vídeo ganham mais) para ganhar pontos, e 
            responda todas as missões para subir de nível e por fim faça a 
            última missão.
        </p>
        <h1> Eu ganho alguma coisa? </h1>
        <p> 
            Peça um certificado para seu responsável. Lembrando que você só
            tem uma chance para fazer cada missão.
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
        <h1> Ranking </h1>
        <div className = {styles.ranking}>
            <span> Codinome </span>
            <span> Missões </span>
            <span> Pontuação </span>
        </div>
        {users.sort((a: User, b: User) => { 
            return getScore(b) - getScore(a);
        }).map((user: User) => 
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
    const [showTask, setShowTask] = useState(false);
    const [tasks, setTasks] = useState([]);

    const { nickname, challengesCompleted, 
        completeChallenge } = useContext(ChallengeContext);

    useEffect(() => {
        function choose(choices: Question[]) {
            var index = Math.floor(Math.random() * choices.length);
            return choices[index];
        }
        let tempTasks = [];
        while (tempTasks.length < TEST_COUNT) {
            let task = choose(props.finalTest);
            if (tempTasks.indexOf(task) === -1) {
                tempTasks.push(task)
            }
        }
        setTasks(tempTasks);
    }, [])

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
                    quests = {tasks}
                    finishFunc = {_finishTest}
                    username = {nickname} />
            : <> 
            <section className = {styles.reward} >
                <div>
                    <Infos/>
                </div>
                <div>
                    <Podium users = {props.users}/>
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
                    disabled = {challengesCompleted !== 14}
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

    const { data: testTasks } = await axios.get(
        serverURL + "/api/questions/", { data: { mission: 15 } }
        ).catch(err => {
            console.error(err);
            return { data: [] }
        })

    const users = userCollection.users as User[];

    return {
        props: {
            users: users,
            finalTest: testTasks
        },
        revalidate: 60
    }
}