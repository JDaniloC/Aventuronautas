import CompletedChallenges from '../components/CompletedChallenges';
import { ChallengesProvider } from '../contexts/ChallengeContext';
import ExperienceBar from '../components/ExperienceBar'
import MissionSelect from '../components/MissionSelect'
import FinishGame from '../components/FinishGame'
import Profile from '../components/Profile'

import Head from 'next/head';
import { GetServerSideProps } from 'next';

import styles from "../styles/pages/Home.module.css";

interface HomeProps {
  level: number;
  nickname: string;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props: HomeProps) {  
  return (
    <ChallengesProvider 
      level = {props.level}
      nickname = {props.nickname}
      currentExperience = {props.currentExperience}
      challengesCompleted = {props.challengesCompleted}
      >
      <div className={styles.container}>
        <Head>
          <title> Início | Aventura Espacial </title>
        </Head>

        <ExperienceBar />
        
        <section>
          <div>
            <Profile />
            <CompletedChallenges />
          </div>
          <FinishGame />
        </section>

        <MissionSelect />
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