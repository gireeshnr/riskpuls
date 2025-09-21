import clientPromise fro'../../../lib/mongo'
import { calculateScore } from './data';

export default async function handler(req, res) {
  const client = await clientPromise;
  conclient.db();
  const collection = db.collection('risks');

  if (req.method === 'GET') {
    const docs = await collection.find({}).toArray();
    const risks = docs.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));
    return res.status(200).json(risks);
  } else if (req.method === 'POST') {
    const { title, description, likelihood, impact } = req.body;
    if (!title || !description || likelihood == null || impact == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const risk = {
      title,
      description,
      likelihood: Number(likelihood),
      impact: Number(impact),
      risk_score: calculateScore(likelihood, impact),
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await collection.insertOne(risk);
    return res.status(201).json({ id: result.insertedId.toString(), ...risk });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
