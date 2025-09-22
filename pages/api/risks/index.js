import clientPromise from '../../../lib/mongo';
import { calculateScore } from './data';

/**
 * API route for the collection of risks.
 * - GET: returns an array of risks (not { risks: [] })
 * - POST: creates a new risk. Requires title, description, likelihood, impact.
 */
export default async function handler(req, res) {
  try {
    // Get a connected MongoDB client
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('risks');

    if (req.method === 'GET') {
      // Fetch all risk documents and map _id to id
      const docs = await collection.find({}).toArray();
      const risks = docs.map(({ _id, ...rest }) => ({
        id: _id.toString(),
        ...rest,
      }));

      // Return the array directly so UI can do risks.map(...)
      return res.status(200).json(risks);
    }

    if (req.method === 'POST') {
      // Parse and validate the request body
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { title, description, likelihood, impact, status = 'open', frameworks = [] } = body || {};

      if (!title || !description || likelihood === undefined || impact === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const L = Number(likelihood);
      const I = Number(impact);

      const newRisk = {
        title,
        description,
        likelihood: L,
        impact: I,
        risk_score: calculateScore(L, I),
        status,
        frameworks,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = await collection.insertOne(newRisk);
      return res.status(201).json({ id: result.insertedId.toString(), ...newRisk });
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (err) {
    // Catch-all to avoid leaking 500s to the client without context
    console.error('Risks API error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
