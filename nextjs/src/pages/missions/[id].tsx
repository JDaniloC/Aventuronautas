import { GetServerSideProps } from "next";
import Head from 'next/head';
import { useRouter } from "next/router";

import styles from "../../styles/pages/Mission.module.css";

export default function Mission() {  
    const router = useRouter();
    const id = router.query.id;

    return (
        <div className = {styles.container}>
            <Head>
                <title> Missão {id} | O criador da lua  </title>
                <link rel="shortcut icon" href="../favicon.png" type="image/x-icon"/>
            </Head>
            <h1> Missão {id} | O criador da lua </h1>
            <section className = {styles.main}>
                <div> 
                    <h2> Contexto </h2>
                    <img src="../missions/1.png" />
                </div>
                <div>
                    <h2> Explicação </h2>
                    <iframe width="100%" height="500" src="https://www.youtube.com/embed/V2T_bkOs0xA" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
            </section>
            <section className = {styles.main}> 
                <div>
                    <h2> Exercícios </h2>
                    <img src="../missions/1.2.png" />
                </div>
                <div>
                    <h2> Questionário </h2>
                    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeq979jwrysJM3RN6vdZQdyAuw1HbKOdamGp_C1Vq30aM4r1Q/viewform?embedded=true" width="100%" height="100%" frameBorder="0" marginHeight = {0} marginWidth = {0}>Carregando…</iframe>
                </div>
            </section>
            <section className = {styles.complete}>
                <p>
                    Eu aceito que a bíblia é a palavra de Deus e desejo ser obediente.
                </p>
                <button> Completar missão </button>
            </section>
        </div>
    )
}
