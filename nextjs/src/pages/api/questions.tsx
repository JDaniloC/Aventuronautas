import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './missions';

export default async (req: VercelRequest, res: VercelResponse) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);
    
    if (req.method === 'GET') {
        const questionsCollection = db.collection('questions');
        const { mission } = req.body;
        const questions = await questionsCollection.find({
            mission }).toArray();
        res.status(200).json(questions);
    } else {
        const answersCollection = db.collection('answers');
        const { username, mission, answers } = req.body;
        const answerData = { username, mission, answers };
        answersCollection.insertOne(answerData);
        res.status(200).json(answerData);
    }
}
  