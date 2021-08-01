import styles from '../styles/components/Task.module.css';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import axios from 'axios';

const starJson = require('../../public/gifs/star.json');

export interface Question {
    id: string;
    type: string;
    level: number;
    title: string;
    mission: number;
    options: string[] | string[][];
}
export interface Answer {
    id: string;
    title: string;
    option: string | number[];
}

export interface RevisionData {
    questions: Question[];
    hits: number[];
}

export interface TaskData {
    username: string, 
    quests: Question[], 
    finishFunc: (value: number) => void 
}

export function RadioTable({ question }: { question: Question }) {
    return(<>{
    question.options.map(option => (
        <label key = {option}>
            <input 
                type="radio" 
                name = {question.id}
                value = {option}/>
            <span></span>
            <p> {option} </p>
        </label>
    ))}</>)
}

export function SelectTable({ question }: { question: Question }) {
    const [rowList, setRowList] = useState([]);
    const [columnList, setColumnList] = useState([]);

    useEffect(() => {
        setRowList(question.options[0] as string[]);
        setColumnList(question.options[1] as string[]);
    }, [])

    return (<table className = {styles.selectTable}>
        <thead>
            <tr>
                <th></th>
                {columnList.map(column => (
                    <th> {column} </th>
                ))} 
            </tr>
        </thead>
        <tbody>
            {rowList.map((row, rowIndex) => (
                <tr>
                <th> {row} </th>
                {columnList.map((_, index) => (
                    <th>
                    <label>
                        <input 
                            name = {String(rowIndex)}
                            type="radio" value = {index}/> 
                        <span></span>
                    </label>
                    </th>
                ))}
                </tr>
            ))}
        </tbody>
    </table>)
}

export function RevisionComponent({ questions, hits }: RevisionData ) {
    const [starCount, setStarCount] = useState([]);
    const [notStarCount, setNotStarCount] = useState([0, 1, 2, 3, 4]);

    useEffect(() => {
        let sum = hits.reduce((a, b) => a + b, 0);
        let relative = sum / (hits.length * 100);
        let score = Math.floor(relative * 5);
        let stars = [], notStars = [];
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

    return (<div className = "revision">
        <div className = {styles.starComponent}>
            {starCount.map((key) => 
                <div key = {key}>
                    <Lottie options={defaultOptions}
                        height = {150} width = {150}/>
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

export default function Task({ username, quests, finishFunc }: TaskData) {
    const [questions, setQuestions] = useState([] as Question[]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([] as Answer[]);
    const [mission, setMission] = useState(0);
    const [score, setScore] = useState(0);
    const [hits, setHits] = useState([]);

    useEffect(() => {
        setQuestions(quests);
        if (quests.length > 0) setMission(quests[0].mission);
        setAnswers(quests.map(quest => ({
            id: quest.id, title: quest.title,
            option: (quest.type == "radio") ? "" : [],
        })));
    }, [])
    
    async function sendAnswers() {
        _nextQuestion();
        const { data } = await axios.post("/api/questions/", 
        { username, answers, mission });
        setScore(data.score);
        setHits(data.hits);
    }
    function closeTask() {
        finishFunc(score);
    }
    function _prevQuestion() {
        setCurrentQuestion(currentQuestion - 1);
    }
    function _nextQuestion() {
        setCurrentQuestion(currentQuestion + 1);
    }

    function selectAnswer(evt) {
        const questionId = parseInt(evt.target.name);
        const answer = evt.target.value;
        
        if (questions[currentQuestion].type === "radio") {
            let found = false;
            for (let index = 0; index < answers.length && !found; ++index) {
                const element = answers[index];
                if (parseInt(element.id) === questionId) {
                    element.option = answer;
                }
            }
        } else {
            if (answers[currentQuestion].option.length === 0) {
                let headers = questions[currentQuestion].options[0] as String[];
                answers[currentQuestion].option = headers.map(() => 0)
            }
            let currentAnswer = answers[currentQuestion].option as number[];
            currentAnswer[questionId] = parseInt(answer);
        }
        
    }

    return (
        <div className = {styles.form}>
            {questions.map((question, index) => (
                <div onChange = {selectAnswer} 
                    key = {question.id}
                    style = {{ 
                        display: index === currentQuestion 
                            ? "block" : "none" }}>
                    <h1> {question.title} </h1>
                    {(question.type == "radio") ? 
                        <RadioTable question = {question} />
                    : <SelectTable question = {question} /> }
                </div>
            ))}

            {(currentQuestion === questions.length) ? <>
                <RevisionComponent questions = {questions}
                    hits = {hits}/>
                <button type = "button" 
                    onClick = {closeTask}>
                    Receber pontos!
                </button> 
            </> : 
            <div className = {styles.buttonContainer}>
                {currentQuestion > 0 && 
                currentQuestion < questions.length ? 
                    <button type = "button" 
                        onClick = {_prevQuestion}>
                        Anterior
                    </button> 
                : <></>}

                {currentQuestion === questions.length - 1 ? 
                    <button type = "button" 
                        onClick = {sendAnswers}>
                        Completar
                    </button> 
                    : 
                    <button type = "button" 
                        onClick = {_nextQuestion}>
                        Próxima
                    </button>}
            </div>}
        </div>    
    )
}