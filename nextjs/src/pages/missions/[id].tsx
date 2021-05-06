import Head from 'next/head';
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { ChallengesProvider } from '../../contexts/ChallengeContext';

import ExperienceBar from '../../components/ExperienceBar'
import CompleteMission from '../../components/CompleteMission'
import styles from "../../styles/pages/Mission.module.css";

interface HomeProps {
    level: number;
    nickname: string;
    currentExperience: number;
    challengesCompleted: number;
}  

export default function Mission(props: HomeProps) {  
    const router = useRouter();
    const id = router.query.id;

    return (
        <ChallengesProvider 
            level = {props.level}
            nickname = {props.nickname}
            currentExperience = {props.currentExperience}
            challengesCompleted = {props.challengesCompleted}
        >
            <ExperienceBar />
            <div className = {styles.container}>
                <Head>
                    <title> Missão {id} | O criador da lua  </title>
                    <link rel="shortcut icon" href="../favicon.png" type="image/x-icon"/>
                </Head>
                <h1> Missão {id} | O criador da lua </h1>
                <section className = {styles.studyContainer}>
                    <div> 
                        <h2> Contexto da missão </h2>
                        <img src="../missions/1.png" />
                    </div>
                    <div>
                        <h2> Explorando terreno </h2>
                        <img src="../missions/1.2.png" />
                    </div>
                </section>
                <section className = {styles.main}> 
                    <div>
                        <h2> Tarefas da missão </h2>
                        <iframe style = {{minHeight: "42em"}} 
                        src="https://docs.google.com/forms/d/e/1FAIpQLSeq979jwrysJM3RN6vdZQdyAuw1HbKOdamGp_C1Vq30aM4r1Q/viewform?embedded=true" width="100%" height="100%" frameBorder="0" marginHeight = {0} marginWidth = {0}>Carregando…</iframe>
                    </div>
                    <div>
                        <h2> Explicação </h2>
                        <iframe width="100%" height="500" src="https://www.youtube.com/embed/V2T_bkOs0xA" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                </section>
                <section className = {styles.complete}>
                    <p>
                        Eu aceito que a bíblia é a palavra de Deus e desejo ser obediente.
                    </p>
                    <CompleteMission />
                </section>
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