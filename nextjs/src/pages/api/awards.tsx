import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './missions';

export default async (req: VercelRequest, res: VercelResponse) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);
    const collection = db.collection('awards');
    
    const awards = await collection.find({}).toArray();
    if (!awards) { res.status(404).json({}) }
    res.status(200).json({ awards })
}
  