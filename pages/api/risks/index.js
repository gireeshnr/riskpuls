import clientPromise from '../../../lib/mongo';
import { calculateScore } from './data';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';

export default async function handler(req, res) {
  // Require a signed-in session (middleware also protects, but we enforce here too)
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('risks');

    if (req.method === 'GET') {
      // Optional: light cache for list reads
      res.setHeader('Cache-Control', 'no-store');

      const docs = await collection.find({}).toArray();
      const risks = docs.map(({ _id, ...rest }) => ({
        id: _id.toString(),
        ...rest,
      }));

      return res.status(200).json(risks); // return array directly
    }

    if (req.method === 'POST') {
      // Accept JSON or stringified JSON
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ message: 'Invalid JSON payload' });
        }
      }

      const {
        title,
        description,
        likelihood,
        impact,
        status = 'open',
        frameworks = [],
      } = body || {};

      // Basic validation
      if (!title || !description || likelihood === undefined || impact === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const L = Number(likelihood);
      const I = Number(impact);
      if (Number.isNaN(L) || Number.isNaN(I)) {
        return res.status(400).json({ message: 'likelihood/impact must be numbers' });
      }

      const now = new Date().toISOString();
      const newRisk = {
        title,
        description,
        likelihood: L,
        impact: I,
        risk_score: calculateScore(L, I),
        status,
        frameworks,
        created_at: now,
        updated_at: now,
        // TODO (next phase): org_id from session, created_by, etc.
      };

      const result = await collection.insertOne(newRisk);
      return res.status(201).json({ id: result.insertedId.toString(), ...newRisk });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error('Risks API error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
