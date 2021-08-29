import styles from 'styles/components/Task.module.css';
import { useEffect, useState } from 'react';
import { RevisionData } from "./Models";
import Lottie from 'react-lottie';

import starJson from '@/public/gifs/star.json';

export default function RevisionComponent({ questions, hits }: RevisionData ) {
    const [starCount, setStarCount] = useState([]);
    const [notStarCount, setNotStarCount] = useState([0, 1, 2, 3, 4]);

    useEffect(() => {
        const sum = hits.reduce((a, b) => a + b, 0);
        const relative = sum / (hits.length * 100);
        const score = Math.floor(relative * 5);
        const stars = [], notStars = [];
        for (let i = 1; i <= 5; i++) {
            if (score >= i) {
                stars.push(i);
            } else {
                notStars.push(i);
            }
        }
        setStarCount(stars);
        setNotStarCount(notStars);
    }, [hits])

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: starJson,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (<div className = {styles.revision}>
        <div className = {styles.starComponent}>
            {starCount.map((key) => 
                <div key = {key}>
                    <Lottie options={defaultOptions}/>
                </div>
            )}
            {notStarCount.map((key) => 
                <div key = {key}>
                    <img src="/gifs/not-star.svg" 
                        alt="star border"/>
                </div>
            )}
        </div>
        <div className = {styles.hitsComponent}>
            {hits.map((hit, index) => (
            <div key = {index + hit}>
                <p> {index + 1}. {questions[index].title} </p>
                <p> {hit}% </p>
            </div>))}
        </div>
    </div>)
}