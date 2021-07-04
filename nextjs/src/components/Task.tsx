import styles from '../styles/components/Task.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
export interface Question {
    id: string;
    level: number;
    title: string;
    mission: number;
    options: string[];
}
export interface Answer {
    id: string;
    text: string;
    title: string;
}

export interface TaskData {
    username: string, 
    quests: Question[], 
    finishFunc: () => void 
}

export default function Task({ username, quests, finishFunc }: TaskData) {
    const [questions, setQuestions] = useState([] as Question[]);
    const [answers, setAnswers] = useState([] as Answer[]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [mission, setMission] = useState(0);

    useEffect(() => {
        setQuestions(quests);
        if (quests.length > 0) setMission(quests[0].mission);
        setAnswers(quests.map(quest => ({
            id: quest.id, text: "",
            title: quest.title
        })));
    }, [])
    
    function sendAnswers() {
        axios.post("/api/questions/", {
            username, answers, mission
        });
        finishFunc();
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

        let found = false;
        for (let index = 0; index < answers.length && !found; ++index) {
            const element = answers[index];
            if (parseInt(element.id) === questionId) {
                element.text = answer;
            }
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
                    {question.options.map(option => (
                        <label key = {option}>
                            <input 
                                type="radio" 
                                name = {question.id}
                                value = {option}/>
                            <span></span>
                            <p> {option} </p>
                        </label>
                    ))}
                </div>
            ))}

            <div className = {styles.buttonContainer}>
                {currentQuestion > 0 ? 
                <button type = "button" 
                    onClick = {_prevQuestion}>
                    Anterior
                </button> : <></>}

                {currentQuestion === questions.length - 1 ? 
                <button type = "button" 
                    onClick = {sendAnswers}>
                    Completar
                </button> : 
                <button type = "button" 
                    onClick = {_nextQuestion}>
                    Próxima
                </button> }
            </div>
        </div>    
    )
}