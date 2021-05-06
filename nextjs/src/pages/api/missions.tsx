import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, Db } from 'mongodb';
import url from 'url';

let cachedDb: Db = null;

async function connectToDatabase(uri: string) {
    if (cachedDb) {
        return cachedDb;
    }
    
    const client = MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const dbName = new url.URL(uri).pathname.substr(1);

    const db = (await client).db(dbName);
    cachedDb = db;

    return db;
}

export default async (req: VercelRequest, res: VercelResponse) => {
    const { id: missionID } = req.body;
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const collection = db.collection('missions');

    const mission = await collection.findOne(
        { mission: parseInt(missionID) })

    if (!mission) { res.status(404).json({}) }

    res.status(200).json({ mission })
}
  