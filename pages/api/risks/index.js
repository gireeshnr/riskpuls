import clientPromise from '../../../lib/mongo';
import { calculateScore } from './data';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../lib/auth';

/**
 * API route for the collection of risks.
 * - GET: returns an array of risks
 * - POST: creates a new risk
 * Requires a valid session.
 */
export default async function handler(req, res) {
  // Require auth
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('risks');

    if (req.method === 'GET') {
      const docs = await collection.find({}).toArray();
      const risks = docs.map(({ _id, ...rest }) => ({
        id: _id.toString(),
        ...rest,
      }));
      return res.status(200).json(risks);
    }

    if (req.method === 'POST') {
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
        // org_id: TODO in next step (multi-tenant)
        // created_by: session.user?.email || null,
      };

      const result = await collection.insertOne(newRisk);
      return res.status(201).json({ id: result.insertedId.toString(), ...newRisk });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error("Risks API error:", err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
