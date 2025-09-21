import clientPromise from '../../../lib/mongo';
import { ObjectId } from 'mongodb';
import { calculateScore } from './data';

export default async function handler(req, res) {
  // Establish a MongoDB client connection
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('risks');

  if (req.method === 'GET') {
    // Fetch all risk documents from MongoDB
    const docs = await collection.find({}).toArray();
    // Map _id to id and remove _id for cleaner API responses
    const risks = docs.map((doc) => {
      const { _id, ...rest } = doc;
      return { id: _id.toString(), ...rest };
    });
    return res.status(200).json({ risks });
  }

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { title, description, likelihood, impact, status = 'open', frameworks = [] } = data;
      if (!title || !description || likelihood === undefined || impact === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const newRisk = {
        title,
        description,
        likelihood: Number(likelihood),
        impact: Number(impact),
        risk_score: calculateScore(likelihood, impact),
        status,
        frameworks,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const result = await collection.insertOne(newRisk);
      return res.status(201).json({ id: result.insertedId.toString(), ...newRisk });
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }
  }
  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
