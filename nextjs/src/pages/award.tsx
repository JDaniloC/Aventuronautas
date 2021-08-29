import CompletedChallenges from '../components/CompletedChallenges';
import { AuthContext } from '../contexts/AuthContext';
import ExperienceBar from '../components/ExperienceBar'
import { Question } from '../components/Task/Models';
import AwardInfo from '../components/AwardInfo';
import Profile from '../components/Profile'
import Task from '../components/Task';
import { User } from 'models/user';

import styles from "../styles/pages/Home.module.css";
import 'react-image-picker/dist/index.css'
import { serverURL } from '../config';

import { useContext, useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

interface Award {
    name: string;
    image: string;
}
interface AwardProps {
    finalTest: Question[];
    users: User[],
}

export default function Award({ finalTest, users }: AwardProps) {  
    const [showTask, setShowTask] = useState(false);
    const [tasks, setTasks] = useState([]);

    const { nickname, challengesCompleted, idade,
        completeChallenge } = useContext(AuthContext);

    useEffect(() => {
        function choose(choices: Question[]) {
            var index = Math.floor(Math.random() * choices.length);
            return choices[index];
        }
        let difficulty = 0;
        const tempTasks = [];
        while (difficulty < (idade - 1) * 2) {
            const task = choose(finalTest);
            if (tempTasks.indexOf(task) === -1) {
                difficulty += task.difficulty;
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
            <AwardInfo users = {users} />
            
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

export const getStaticProps:GetStaticProps = async () => {
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