import CompletedChallenges from '../components/CompletedChallenges';
import { ChallengesProvider } from '../contexts/ChallengeContext';
import ExperienceBar from '../components/ExperienceBar'
import Profile from '../components/Profile'

import { GetStaticProps } from 'next';
import Head from 'next/head';

import styles from "../styles/pages/Home.module.css";
import { serverURL } from '../config';
import axios from 'axios';

import ImagePicker from 'react-image-picker';
import 'react-image-picker/dist/index.css'
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Award {
    name: string;
    image: string;
}

interface AwardProps {
  awards: Award[]
}

export default function Home(props: AwardProps) {  
    const [awards, setAwards] = useState([]);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        setAwards(props.awards);
    }, [])

    function onPick(selected:{ src:string, value:number }) {
        setSelected(awards[selected.value]?.name)
    }

    return (
        <ChallengesProvider>
        <div className={styles.container}>
            <Head>
            <title> Recompensa | Aventura Espacial </title>
            </Head>

            <ExperienceBar />
            
            <section>
                <Profile />
                <CompletedChallenges />
            </section>

            <section className = {styles.reward} >
                <div>
                    <h1> Qual será sua recompensa? </h1>
                    <p> 
                        Se você completou todas as 14 missões e está entre os três primeiros finalistas, você pode escolher um destes prêmios! Mas antes, você precisa passar por um último testem no qual só tem <b>uma</b> chance!
                    </p>
                    
                    <h1> Quando irei receber? </h1>
                    <p> 
                        Ao clicar no botão de receber prêmio, você está solicitando que o clube de aventureiros vá na sua casa entregar o prêmio. Lembrando que você só tem até o início de <b>setembro</b> para terminar as missões!
                    </p>
                    
                    <h1> Como posso estar entre os primeiros? </h1>
                    <p> 
                        Complete todas as missões com calma (nós sabemos se você leu/assistiu ou não) para ganhar xp, e responda todos os formulários (ou apresente sua revista respondida).
                    </p>
                </div>
                <div className = {styles.picker}>
                    {selected ? 
                        <h3> Você selecionou {selected} </h3>
                    :<></>}
                    <ImagePicker
                        images = {awards?.map((award, i) => ({
                            src: award.image, value: i}))}
                        onPick = {onPick}
                    />
                </div>
            </section>
            
            <section>
                <Link href = "/">
                    <button className = "project">
                        Voltar
                    </button>
                </Link>
                <button className = "project" disabled
                    style = {{ marginBottom: "2em"}}> 
                    Iniciar teste 
                </button>
            </section>
        </div>
        </ChallengesProvider>
    )
}

export const getStaticProps:GetStaticProps = async (context) => {
    const { data: response } = await axios.get(
        serverURL + "/api/awards/").catch((err) => {
            console.error(err);
            return { data: { awards: [] } }
        })
    const awards = response.awards as Award[];

    return {
        props: {
            awards: awards
        },
        revalidate: 60
    }
}