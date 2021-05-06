import Head from 'next/head';
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { ChallengesProvider } from '../../contexts/ChallengeContext';

import ExperienceBar from '../../components/ExperienceBar'
import CompleteMission from '../../components/CompleteMission'
import styles from "../../styles/pages/Mission.module.css";
import { useEffect, useState } from 'react';
import axios from 'axios';


interface HomeProps {
    level: number;
    nickname: string;
    currentExperience: number;
    challengesCompleted: number;
}  

interface MissionInfos {
    questions: string;
    video: string;
    story: string;
    title: string;
    icon: string;
    form: string;
}

export default function Mission(props: HomeProps) {  
    const [ infos, setInfos ] = useState({
        title: "Aventuronautas | Carregando..."
    } as MissionInfos)
    const router = useRouter();
    const id = router.query.id;

    useEffect(() => {
        axios.post(
            "/api/missions", { id }
        ).then((response) => {
            const missionInfo = response.data;
            if (missionInfo) {
                setInfos(missionInfo.mission);
            }
        })
    }, [])

    return (
        <ChallengesProvider 
            level = {props.level}
            nickname = {props.nickname}
            currentExperience = {props.currentExperience}
            challengesCompleted = {props.challengesCompleted}
        >
            <div className = {styles.externalContainer}>
            <ExperienceBar/>
            <div className = {styles.container}>
                <Head>
                    <title> {infos.title}  </title>
                    <link rel="shortcut icon" href="../favicon.png" type="image/x-icon"/>
                </Head>
                <h1> {infos.title} </h1>
                {(infos.form) ? 
                    <>
                    <section className = {styles.studyContainer}>
                        <div> 
                            <h2> Contexto da missão </h2>
                            <img src = {infos.story} />
                        </div>
                        <div>
                            <h2> Explorando terreno </h2>
                            <img src = {infos.questions} />
                        </div>
                    </section>
                    <section className = {styles.main}> 
                        <div>
                            <h2> Tarefas da missão </h2>
                            <iframe style = {{minHeight: "42em"}} 
                            src = {infos.form} width="100%" height="100%" frameBorder="0" marginHeight = {0} marginWidth = {0}>Carregando…</iframe>
                        </div>
                        <div>
                            <h2> Explicação </h2>
                            <iframe width="100%" height="500" src = {infos.video} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                    </section>
                    </>
                : <p> Carregando... </p>}
                <section className = {styles.complete}>
                    <p>
                        Eu aceito que a bíblia é a palavra de Deus e desejo ser obediente.
                    </p>
                    <CompleteMission />
                </section>
            </div>
            </div>
        </ChallengesProvider>
    )
}

export const getServerSideProps:GetServerSideProps = async (context) => {
    const { nickname, level, currentExperience, challengesCompleted } = context.req.cookies;
    
    return {
      props: {
        level: level !== undefined ? Number(level) : 1,
        nickname: nickname !== undefined ? nickname : "Novato(a)",
        currentExperience: currentExperience !== undefined ? Number(currentExperience) : 0,
        challengesCompleted: challengesCompleted !== undefined ? Number(challengesCompleted) : 0
      }
    }
}