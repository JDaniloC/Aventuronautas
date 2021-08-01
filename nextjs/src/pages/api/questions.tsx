import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './missions';

export interface Answer {
    id: string;
    option: string | number[];
    title: string;
}

function compareAnswers(correct: number[], answer: number[]) {
    let total = correct.length;
    let current = 0;
    correct.forEach((value, index) => {
        if (value === answer[index]) {
            current += 1;
        }
    })
    return current / total;
}

export default async (req: VercelRequest, res: VercelResponse) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);
    const questionsCollection = db.collection('questions');
    
    if (req.method === 'GET') {
        const { mission } = req.body;
        const questions = await questionsCollection.find(
            { mission }, { projection: { answer: false } }
            ).toArray();
            res.status(200).json(questions);
    } else {
        const { mission, answers } = req.body;
        const questions = await questionsCollection.find(
            { mission }, { projection: { type:true,
                id:true, options: true, answer: true 
            }}).toArray();
        let score = 0;

        let hits: number[] = [];
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            
            let correct = question.type === "radio" ? 
                question.options[question.answer] : question.answer;

            answers.forEach((answer: Answer) => {
                if (question.id === answer.id) {
                    if (question.type === "radio"
                        && correct === answer.option) {
                        score += 1;
                        hits.push(100);
                    } else if (question.type !== "radio") {
                        var currentScore = compareAnswers(correct, 
                            answer.option as number[]);
                        hits.push(Math.round(currentScore * 100));
                        score += currentScore;
                    } else {
                        hits.push(0);
                    }
                }
            })
            
        }
        score = Math.round((score / answers.length) * 100);
        res.status(200).json({ score, hits });
    }
}
  