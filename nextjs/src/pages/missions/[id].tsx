import Head from 'next/head';
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useEffect, useState } from 'react';


import ExperienceBar from '../../components/ExperienceBar'
import CompleteMission from '../../components/CompleteMission'
import { ChallengesProvider } from '../../contexts/ChallengeContext';


import styles from "../../styles/pages/Mission.module.css";
import ImageGallery from 'react-image-gallery';
import axios from 'axios';
import { serverURL } from '../../config';

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
    const [ images, setImages ] = useState([]);
    const [ subMission, setSubMission ] = useState(<> Carregando... </>);
    const [ actualStep, setActualStep ] = useState(-1);

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
            switch (actualStep) {
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
                    newSubMission = <ImageGallery items={images} />
                    break;
            }
            setSubMission( newSubMission );
            return subMission;
        }
        
        changeStep();
    }, [actualStep])

    function prevStep() {
        setActualStep( (actualStep - 1) % 3 )
    }

    function nextStep() {
        setActualStep( (actualStep + 1) % 3 )
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
                    <>
                    <section className = {styles.studyContainer}>
                        { subMission }
                    </section>
                    </>
                : <p> Carregando... </p>}
                <section className = {styles.complete}>
                    {(actualStep == 0) ? 
                        <button onClick = {() => {router.push("/")}}>
                            Voltar à sala de comando
                        </button>
                    : <button onClick = {prevStep}>
                        Tarefa anterior
                    </button>}

                    {(actualStep == 2) ? 
                        <CompleteMission missionID = {id} />
                    : <button onClick = {nextStep}>
                        Próxima tarefa
                    </button>}
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