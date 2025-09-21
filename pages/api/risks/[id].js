import clientPromise from '../../../lib/mongo';
import { ObjectId } from 'mongodb';
import { calculateScore } from './data';

/**
 * API route for single risk operations. This route supports the following methods:
 * - GET: Retrieve a single risk by id
 * - PUT: Update an existing risk. Only provided fields are updated; missing fields stay unchanged.
 *   If likelihood or impact are updated, the risk_score will be recalculated.
 * - DELETE: Remove a risk from the database
 */
export default async function handler(req, res) {
  const { id } = req.query;
  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (e) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const client = await clientPromise;
  const collection = client.db().collection('risks');

  if (req.method === 'GET') {
    const doc = await collection.findOne({ _id: objectId });
    if (!doc) {
      return res.status(404).json({ message: 'Risk not found' });
    }
    const { _id, ...rest } = doc;
    return res.status(200).json({ id: _id.toString(), ...rest });
  }

  if (req.method === 'PUT') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { title, description, likelihood, impact, status, frameworks } = data;
      const updateDoc = {};
      if (title !== undefined) updateDoc.title = title;
      if (description !== undefined) updateDoc.description = description;
      if (likelihood !== undefined) updateDoc.likelihood = Number(likelihood);
      if (impact !== undefined) updateDoc.impact = Number(impact);
      if (status !== undefined) updateDoc.status = status;
      if (frameworks !== undefined) updateDoc.frameworks = frameworks;
      // recalculate risk_score if likelihood or impact is updated
      if (updateDoc.likelihood !== undefined || updateDoc.impact !== undefined) {
        const existing = await collection.findOne({ _id: objectId });
        if (!existing) {
          return res.status(404).json({ message: 'Risk not found' });
        }
        const currentLikelihood = updateDoc.likelihood !== undefined ? updateDoc.likelihood : existing.likelihood;
        const currentImpact = updateDoc.impact !== undefined ? updateDoc.impact : existing.impact;
        updateDoc.risk_score = calculateScore(currentLikelihood, currentImpact);
      }
      updateDoc.updated_at = new Date().toISOString();
      await collection.updateOne({ _id: objectId }, { $set: updateDoc });
      const updated = await collection.findOne({ _id: objectId });
      const { _id, ...rest } = updated;
      return res.status(200).json({ id: _id.toString(), ...rest });
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }
  }

  if (req.method === 'DELETE') {
    await collection.deleteOne({ _id: objectId });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
