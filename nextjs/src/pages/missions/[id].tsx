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
    const [ subMission, setSubMission ] = useState(<> Carregando... </>);
    const [ xpEarned, setXpEarned ] = useState([false, false, false]);
    const [ currentStep, setCurrentStep ] = useState(-1);
    const [ images, setImages ] = useState([]);

    const router = useRouter();
    const id = router.query.id;  

    useEffect(() => {
        axios.post(
            serverURL + "/api/missions", { id }
        ).then((response) => {
            const missionInfo = response.data;
            if (missionInfo.mission) {
                const mission = missionInfo.mission as MissionInfos;
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
        })
    }, [])

    useEffect(() => {
        function changeStep() {
            let newSubMission = <></>;
            switch (currentStep) {
                case 1:
                    newSubMission = (
                        <iframe width="100%" height="500" 
                            src = {infos.video} frameBorder="0" 
                            title="YouTube video player" allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; 
                            encrypted-media; gyroscope; picture-in-picture" >
                        </iframe>)
                    break;
                case 2:
                    newSubMission = (
                        <iframe style = {{minHeight: "42em"}} 
                            src = {infos.form} width="100%" 
                            height="100%" frameBorder="0" 
                            marginHeight = {0} marginWidth = {0}>
                            Carregando…
                        </iframe>)
                    break;
                default:
                    newSubMission = (
                        <div>
                            <p> Apenas para visualização </p>
                            <p> Responda na sua revistinha </p>
                            <ImageGallery items={images} />
                        </div>
                    )
                    break;
            }
            setSubMission( newSubMission );
            return subMission;
        }
        
        changeStep();
    }, [currentStep])

    function prevStep() {
        setCurrentStep( (currentStep - 1) % 3 );
    }

    function nextStep() {
        setCurrentStep( (currentStep + 1) % 3 );
    }

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
                <> <section className = {styles.studyContainer}>
                        { subMission }
                    </section> 
                </> : 
                <div className = "loadingDiv">
                    <img src="/gifs/rocket.gif"/>
                    <p> Carregando... </p>
                </div>}
                <section className = {styles.complete}>
                    {(currentStep == 0) ? 
                        <button onClick = {() => {router.push("/")}}>
                            Voltar à sala de comando
                        </button>
                    : <button onClick = {prevStep}>
                        Tarefa anterior
                    </button>}

                    {(currentStep == 2) ? 
                        <CompleteMission missionID = {id} />
                    : 
                    <CountProvider 
                        nextStep = {nextStep}
                        xpEarned = {xpEarned}
                        setXpEarned = {setXpEarned}>
                        <NextStepButton currentStep = {currentStep} />
                    </CountProvider>
                    }
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