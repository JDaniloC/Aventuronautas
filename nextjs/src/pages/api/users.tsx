import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './missions';

export default async (req: VercelRequest, res: VercelResponse) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);
    const collection = db.collection('users');
    let nickname = (req.body.nickname) ? req.body.nickname : req.query.nickname;
    let user: boolean | {} = false;

    if (nickname) {
        nickname = nickname.replace(/[\W]/g, "").toLowerCase();
        user = await collection.findOne({ nickname });
    } else {
        const users = await collection.find({}).toArray();
        return res.status(200).json({ users })
    }

    if (req.method === 'POST') {
        if (user) {
            return res.status(200).json({ user })
        }
        
        const { idade, image } = req.body;

        const { ops } = await collection.insertOne({
            nickname, idade, image, level: 1, 
            currentExperience: 0, 
            challengesCompleted: 0,
            reward: "Nenhum"
        })

        res.status(201).json({ user: ops[0] })
    } else if (req.method === 'PATCH') {
        if (!user) {
            return res.status(201).json({})
        }

        const {
            level, currentExperience, 
            challengesCompleted, reward
        } = req.body;

        user = await collection.updateOne({ nickname }, {
            $set: {
                level, reward, challengesCompleted,
                currentExperience: currentExperience, 
            }
        })
        res.status(200).json({ user })
    } else {
        res.status(200).json({ user })
    }    
}
  