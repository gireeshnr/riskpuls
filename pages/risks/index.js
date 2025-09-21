import { useState, useEffect } from 'react';

export default function Risks() {
  const [risks, setRisks] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', likelihood: 1, impact: 1 });

  useEffect(() => {
    fetch('/api/risks')
      .then((res) => res.json())
      .then((data) => setRisks(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/risks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const newRisk = await res.json();
    setRisks([...risks, newRisk]);
    setFormData({ title: '', description: '', likelihood: 1, impact: 1 });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Risk Inventory</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Likelihood</label>
            <input
              type="number"
              name="likelihood"
              value={formData.likelihood}
              onChange={handleChange}
              min="1"
              max="5"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Impact</label>
            <input
              type="number"
              name="impact"
              value={formData.impact}
              onChange={handleChange}
              min="1"
              max="5"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Risk
        </button>
      </form>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Likelihood</th>
            <th className="px-4 py-2 border">Impact</th>
            <th className="px-4 py-2 border">Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {risks.map((risk) => (
            <tr key={risk.id}>
              <td className="px-4 py-2 border">{risk.title}</td>
              <td className="px-4 py-2 border">{risk.description}</td>
              <td className="px-4 py-2 border text-center">{risk.likelihood}</td>
              <td className="px-4 py-2 border text-center">{risk.impact}</td>
              <td className="px-4 py-2 border text-center">{risk.risk_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
