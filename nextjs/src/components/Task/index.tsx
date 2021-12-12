import { Question, TaskData, Answer } from './Models';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';

import axios from 'axios';
import RadioTable from './RadioTable';
import CheckTable from './CheckTable';
import SelectTable from './SelectTable';
import RevisionComponent from './Revision';
import styles from 'styles/components/Task.module.css';

export default function Task({ 
    username, quests, customStyles, finishFunc }: TaskData) {
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
    
    const closeTask = useCallback(() => {
        finishFunc(score);
    }, [score, finishFunc]);

    const handlePrevQuestion = useCallback(() => {
        setCurrentQuestion(currentQuestion - 1);
    }, [currentQuestion]);

    const handleNextQuestion = useCallback(() => {
        setCurrentQuestion(currentQuestion + 1);
    }, [currentQuestion]);

    const sendAnswers = useCallback(async () => {
        handleNextQuestion();
        const { data } = await axios.post("/api/questions/", { 
            username, answers, mission });
        setScore(data.score);
        setHits(data.hits);
    }, [currentQuestion]);

    const handleSelectAnswer = useCallback((evt: FormEvent<EventTarget>) => {
        const target = evt.target as HTMLInputElement;
        const questionType = questions[currentQuestion].type;
        const questionId = parseInt(target.name);
        const answer = target.value;

        if (questionType === "radio") {
            answers[currentQuestion].option = answer;
        } else if (questionType === "check") {
            const currentAnswer = answers[currentQuestion].option as number[];
            if (target.checked) {
                currentAnswer.push(parseInt(answer));
            } else {
                currentAnswer.splice(currentAnswer.indexOf(
                    parseInt(answer)), 1);
            }
        } else {
            if (answers[currentQuestion].option.length === 0) {
                const headers = questions[currentQuestion].options[0] as string[];
                answers[currentQuestion].option = headers.map(() => 0)
            }
            const currentAnswer = answers[currentQuestion].option as number[];
            currentAnswer[questionId] = parseInt(answer);
        }
    }, [currentQuestion, answers, questions]);

    return (
        <div className = {styles.form} style = { customStyles }>
            {questions.map((question, index) => (
                <div onChange = {handleSelectAnswer} 
                    key = {question.id}
                    style = {{ 
                        width: "100%",
                        alignSelf: "center",
                        display: index === currentQuestion 
                            ? "block" : "none" }}>
                    <span className = {`difficulty${question.difficulty}`}/> 
                    <h1> {question.title} </h1>
                    {(question.type == "radio") ? 
                        <RadioTable question = {question} />
                    :(question.type == "check") ?
                        <CheckTable question = {question} />
                    : <SelectTable question = {question} /> }
                    <span/>
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
                        onClick = {handlePrevQuestion}>
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
                        onClick = {handleNextQuestion}>
                        Próxima
                    </button>}
            </div>}
        </div>    
    )
}