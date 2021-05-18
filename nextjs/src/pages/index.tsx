import CompletedChallenges from '../components/CompletedChallenges';
import { ChallengesProvider } from '../contexts/ChallengeContext';
import ExperienceBar from '../components/ExperienceBar'
import MissionSelect from '../components/MissionSelect'
import FinishGame from '../components/FinishGame'
import Profile from '../components/Profile'

import Head from 'next/head';
import { GetServerSideProps } from 'next';

import styles from "../styles/pages/Home.module.css";
import axios from 'axios';
import { serverURL } from '../config';

interface challenge {
  mission: number;
  title: string;
  icon: string;
  description: string;
}

interface HomeProps {
  missions: challenge[]
}

export default function Home(props: HomeProps) {  
  return (
    <ChallengesProvider>
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

        <MissionSelect missions = {props.missions} />
      </div>
    </ChallengesProvider>
  )
}

export const getServerSideProps:GetServerSideProps = async (context) => {
  const response = await axios.get(serverURL + "/api/missions/")
  let missionArray = response.data.missions;
  if (missionArray === undefined) { missionArray = [] };

  return {
    props: {
      missions: missionArray
    }
  }
}