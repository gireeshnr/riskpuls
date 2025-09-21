import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Riskpuls</title>
      </Head>
      <main className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Riskpuls</h1>
        <p className="text-lg text-gray-700 mb-4">
          Riskpuls helps you manage your organisation’s risk register with AI‑powered summarisation,
          cross‑framework mapping and dynamic scoring. Build your risk inventory, import existing
          spreadsheets and visualise your risk posture through dashboards and heatmaps.
        </p>
        <p className="text-md text-gray-600 mb-4">
          To get started, sign up for an account and begin creating and importing your risks.
        </p>
        <Link href="/risks" className="text-blue-600 hover:underline">
          Go to Risk Inventory
        </Link>
      </main>
    </div>
  );
}
