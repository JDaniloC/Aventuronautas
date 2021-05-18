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
    }

    if (req.method === 'POST') {
        if (user) {
            return res.status(200).json({ user })
        }

        const { ops } = await collection.insertOne({
            nickname, level: 1, 
            currentExperience: 0, 
            challengesCompleted: 0
        })

        res.status(200).json({ user: ops[0] })
    } else if (req.method === 'PATCH') {
        if (!user) {
            return res.status(201).json({})
        }

        const {
            level, currentExperience, 
            challengesCompleted 
        } = req.body;

        user = await collection.updateOne({ nickname }, {
            $set: {
                level, currentExperience: currentExperience + 1, 
                challengesCompleted
            }
        })
        res.status(200).json({ user })
    } else {
        if (!user) {
            user = {
                nickname: "Novato(a)",
                level: 1, 
                currentExperience: 0, 
                challengesCompleted: 0
            }
        }
        res.status(201).json({ user })
    }    
}
  