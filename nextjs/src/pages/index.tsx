import CompletedChallenges from '../components/CompletedChallenges';
import { ChallengesProvider } from '../contexts/ChallengeContext';
import ExperienceBar from '../components/ExperienceBar'
import MissionSelect from '../components/MissionSelect'
import Profile from '../components/Profile'

import { GetStaticProps } from 'next';
import Head from 'next/head';

import styles from "../styles/pages/Home.module.css";
import finishStyles from "../styles/components/FinishGame.module.css";
import { serverURL } from '../config';
import axios from 'axios';
import React from 'react';
import Link from 'next/link';

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
        <div className = {finishStyles.finishContainer}>
          <h2> Completar todas as missões! </h2>
          <p> Se você completou as 14 missões, clique neste botão. </p>
          <p> Fale com seu conselheiro, para provar o seu valor, </p> 
          <p> e dessa forma, concorrer a brindes, Boa sorte! </p>
          <Link href = "/award/">
            <button className = "project">
                Salvar o mundo
            </button>
          </Link>
        </div>
      </section>

      <MissionSelect missions = {props.missions} />
    </div>
  )
}

export const getStaticProps:GetStaticProps = async (context) => {
  const response = await axios.get(serverURL + "/api/missions/")
  let missionArray = response.data.missions;
  if (missionArray === undefined) { missionArray = [] };

  return {
    props: {
      missions: missionArray
    },
    revalidate: 60
  }
}