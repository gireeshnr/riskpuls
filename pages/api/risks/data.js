let risks = [];

export function getRisks() {
  return risks;
}

export function addRisk(risk) {
  risks.push(risk);
}

export function updateRisk(id, updatedRisk) {
  risks = risks.map((r) => (r.id === id ? { ...r, ...updatedRisk } : r));
}

export function deleteRisk(id) {
  risks = risks.filter((r) => r.id !== id);
}
