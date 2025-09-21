import { getRisks, updateRisk, deleteRisk } from './data';

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const risks = getRisks();
    const risk = risks.find((r) => r.id === id);
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }
    return res.status(200).json(risk);
  } else if (req.method === 'PUT') {
    const { title, description, likelihood, impact } = req.body;
    const updatedRisk = {
      title,
      description,
      likelihood: Number(likelihood),
      impact: Number(impact),
      risk_score: Number(likelihood) * Number(impact),
    };
    updateRisk(id, updatedRisk);
    const risks = getRisks();
    const risk = risks.find((r) => r.id === id);
    return res.status(200).json(risk);
  } else if (req.method === 'DELETE') {
    deleteRisk(id);
    return res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
