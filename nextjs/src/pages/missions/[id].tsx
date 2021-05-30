import Head from 'next/head';
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from 'react';


import ExperienceBar from '../../components/ExperienceBar'
import { CompleteMission, NextStepButton } from '../../components/CompleteMission'
import { ChallengesProvider } from '../../contexts/ChallengeContext';


import styles from "../../styles/pages/Mission.module.css";
import ImageGallery from 'react-image-gallery';
import { serverURL } from '../../config';
import axios from 'axios';
import { CountProvider } from '../../contexts/CountContext';

interface HomeProps {
    id: number,
    level: number;
    nickname: string;
    mission: MissionInfos;
    currentExperience: number;
    challengesCompleted: number;
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

export default function Mission(props: HomeProps) {  
    const [ infos, setInfos ] = useState({
        title: "Aventuronautas | Carregando..."
    } as MissionInfos)
    const [ xpEarned, setXpEarned ] = useState([false, false, false]);
    const [ currentStep, setCurrentStep ] = useState(-1);
    const [ images, setImages ] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const mission = props.mission;
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

    function prevStep() {
        setCurrentStep( (currentStep - 1) % 3 );
    }

    function nextStep() {
        setCurrentStep( (currentStep + 1) % 3 );
    }

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
                            display: (currentStep === 0) ? "block" : "none"}}>
                            <p> Apenas para visualização </p>
                            <p> Responda na sua revistinha </p>
                            <ImageGallery items={images} />
                        </div>
                         
                        <iframe allowFullScreen style = {{ 
                            display: (currentStep === 1) ? "flex" : "none"}}
                            width="100%" height="500" src = {infos.video} 
                            frameBorder="0" title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; 
                            encrypted-media; gyroscope; picture-in-picture" >
                        </iframe> 

                        <iframe src = {infos.form} style = {{ 
                            display: (currentStep === 2) ? "flex" : "none",
                            minHeight: "42em"}} marginWidth = {0}
                            width="100%" height="100%" frameBorder="0" 
                            marginHeight = {0}>
                            Carregando…
                        </iframe>
                    </section> 
                </> : 
                <div className = "loadingDiv">
                    <img src="/gifs/rocket.gif"/>
                    <p> Carregando... </p>
                </div>}
                
                {(currentStep == 2) ?
                <p className = {styles.confession}>
                    {infos.confession}
                </p> : <></>}

                <section className = {styles.complete}>
                    {(currentStep == 0) ? 
                        <button className = "project"
                            onClick = {() => {router.push("/")}}>
                            Voltar à sala de comando
                        </button>
                    : <button className = "project"
                        onClick = {prevStep}>
                        Tarefa anterior
                    </button>}

                    <CountProvider 
                        nextStep = {nextStep}
                        xpEarned = {xpEarned}
                        setXpEarned = {setXpEarned}>
                        
                        {(currentStep == 2) ? 
                            <CompleteMission missionID = {props.id} />
                        : <NextStepButton currentStep = {currentStep} />}
                        
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

export async function getStaticProps(context) {
    const id = context.params.id;

    const { data } = await axios.post(
        serverURL + "/api/missions", { id }
    )

    return { props: { 
        mission: data.mission as MissionInfos,
        id: id
    } }
}