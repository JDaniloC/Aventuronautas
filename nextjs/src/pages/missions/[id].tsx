import Head from 'next/head';
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from 'react';

import ExperienceBar from '../../components/ExperienceBar'
import { CountProvider } from '../../contexts/CountContext';
import { Question } from 'components/Task/Models';
import { NextStepButton } from '../../components/CompleteMission'

import { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import styles from "../../styles/pages/Mission.module.css";
import { AuthContext } from 'contexts/AuthContext';
import ImageGallery from 'react-image-gallery';
import { serverURL } from '../../config';
import Task from 'components/Task';
import axios from 'axios';

interface HomeProps {
    id: number,
    tasks: Question[];
    mission: MissionInfos;
}  

interface MissionInfos {
    confession: string;
    questions: string;
    mission: string;
    video: string;
    story: string;
    title: string;
    icon: string;
    form: string;
}

export default function Mission({ id, mission, tasks }: HomeProps) {  
    const [ infos, setInfos ] = useState({
        title: "Aventuronautas | Carregando..."
    } as MissionInfos)

    const [ xpEarned, setXpEarned ] = useState([false, false, false]);
    const [ currentStep, setCurrentStep ] = useState(-1);
    const [ finished, setFinished ] = useState(false);
    const [ images, setImages ] = useState([]);
    
    const { nickname, challengesCompleted, 
        completeChallenge 
    } = useContext(AuthContext);
    const router = useRouter();
    
    function prevStep() {
        setCurrentStep( (currentStep - 1) % 3 );
    }

    function nextStep() {
        setCurrentStep( (currentStep + 1) % 3 );
    }

    function handleGoHome() {
        router.push("/")
    }

    function _finishTest(score: number) {
        if (challengesCompleted < id) {
            completeChallenge(score);
        }
        setFinished(true);
    }

    useEffect(() => {
        if (mission) {
            setInfos(mission);
            setImages([{
                original: mission.story,
                thumbnail: mission.story
            }, {
                original: mission.questions,
                thumbnail: mission.questions
            }]);
            nextStep();
        }
    }, [])

    return (
        <div className = {styles.externalContainer}>
            
            <ExperienceBar/>

            <div className = {styles.container}>
                <Head>
                    <title> {infos.title}  </title>
                    <link rel="shortcut icon" href="../favicon.png" type="image/x-icon"/>
                </Head>

                <h1> {infos.title} </h1>
                {(infos.form) ? 
                <> <section className = {styles.studyContainer}>
                        <div style = {{ 
                            display: (currentStep === 0) ? "flex" : "none",
                            flexDirection: 'column', alignItems: 'center'}}>
                            <p className = {styles.confession}> 
                                Apenas para visualização. <br/>
                                Responda na sua revistinha 
                            </p>
                            <ImageGallery items={images} />
                        </div>
                         
                        <iframe allowFullScreen style = {{ 
                            display: (currentStep === 1) ? "flex" : "none"}}
                            width="100%" height="500" src = {infos.video} 
                            frameBorder="0" title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; 
                            encrypted-media; gyroscope; picture-in-picture"/> 
                        
                        <Task quests = {tasks} username = {nickname}
                            finishFunc = {_finishTest} style = {{
                                display: (currentStep === 2 && !finished
                                    ) ? "flex" : "none"
                            }}/>
                        
                        {(currentStep === 2 && finished) ? 
                            <p className = {styles.confession}> 
                                Parabéns, aventureiros! 
                                Você aceita o compromisso abaixo? 
                            </p> 
                        : <></>}

                    </section> 
                </> : 
                <div className = "loadingDiv">
                    <img src="/gifs/rocket.gif"/>
                    <p> Carregando... </p>
                </div>}
                
                {(currentStep === 2) ?
                <p className = {styles.confession}>
                    {infos.confession}
                </p> : <></>}

                <section className = {styles.complete}>
                    {(currentStep == 0) ? 
                        <button className = "project"
                            type = "button"
                            onClick = {handleGoHome}>
                            Voltar à sala de comando
                        </button>
                    : <button className = "project"
                        type = "button"
                        onClick = {prevStep}>
                        Tarefa anterior
                    </button>}

                    <CountProvider 
                        nextStep = {nextStep}
                        xpEarned = {xpEarned}
                        setXpEarned = {setXpEarned}>
                        <NextStepButton currentStep = {currentStep} />
                    </CountProvider>
                </section>
            </div>
        </div>
    )
}

export async function getStaticPaths() {
    const { data } = await axios.get(serverURL + "/api/missions/")
    const missions = data.missions;

    return {
        paths: missions.map((item: MissionInfos) => ({
            params: { id: String(item.mission) }
        })),
        fallback: false
     }
}

export async function getStaticProps(
    context: GetStaticPropsContext): Promise<GetStaticPropsResult<HomeProps>> {
    

    const id = parseInt(context.params.id as string);

    const { data } = await axios.post(
        serverURL + "/api/missions", { id }
    )

    const taskReq = { data: { mission: id } };
    const { data: taskRes } = await axios.get(
        serverURL + "/api/questions/", taskReq).catch(err => {
            console.error(err);
            return { data: [] }
        })

    return { 
        props: { 
            mission: data.mission as MissionInfos,
            tasks: taskRes,
            id: id
        },
        revalidate: false
    }
}