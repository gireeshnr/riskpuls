import { getRisks, addRisk } from './data';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const risks = getRisks();
    return res.status(200).json(risks);
  } else if (req.method === 'POST') {
    const { title, description, likelihood, impact } = req.body;
    const id = Date.now().toString();
    const risk = {
      id,
      title,
      description,
      likelihood: Number(likelihood),
      impact: Number(impact),
      risk_score: Number(likelihood) * Number(impact),
    };
    addRisk(risk);
    return res.status(201).json(risk);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
