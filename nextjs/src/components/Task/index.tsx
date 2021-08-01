import { Question, TaskData, Answer } from './Models';
import styles from 'styles/components/Task.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

import RadioTable from './RadioTable';
import SelectTable from './SelectTable';
import RevisionComponent from './Revision';

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