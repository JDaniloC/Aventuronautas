import styles from '../styles/components/Task.module.css';
import { useEffect, useState } from 'react';

export interface Question {
    id: string;
    title: string;
    options: string[];
}
export interface Answer {
    id: string;
    text: string;
    title: string;
}

export default function Task({ quests }) {
    const [questions, setQuestions] = useState([] as Question[]);
    const [answers, setAnswers] = useState([] as Answer[]);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    useEffect(() => {
        setQuestions(quests);
        setAnswers(quests.map(quest => (
            {
                id: quest.id,
                text: "",
                title: quest.title
            }
        )));
    }, [])
    
    function sendAnswers() {
        console.log(answers);
    }
    function _prevQuestion() {
        setCurrentQuestion(currentQuestion - 1);
    }
    function _nextQuestion() {
        setCurrentQuestion(currentQuestion + 1);
    }

    function selectAnswer(evt) {
        const questionId = evt.target.name;
        const answer = evt.target.value;

        let found = false;
        for (let index = 0; index < answers.length && !found; ++index) {
            const element = answers[index];
            if (element.id === questionId) {
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

            {currentQuestion > 0 ? 
            <button type = "button" 
                onClick = {_prevQuestion}>
                Anterior
            </button> : <></>}

            {currentQuestion === questions.length - 1 ? 
            <button type = "button" 
                onClick = {_nextQuestion}>
                Próxima
            </button> : 
            <button type = "button" 
                onClick = {sendAnswers}>
                Completar
            </button>}
        </div>    
    )
}