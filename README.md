# Riskpuls

Riskpuls is a web‑based risk register platform designed to help organisations manage and report on risk.  It leverages modern web technologies and AI to automate data entry, scoring and compliance mapping.

## Features

- **Risk inventory**: create, update and view risks in a centralised database.
- **CSV import**: migrate existing spreadsheet‑based risk registers.
- **AI summarisation**: paste unstructured incident reports and receive summarised risk statements (to be implemented).
- **Dynamic scoring**: compute risk scores based on likelihood and impact.
- **Framework mapping**: associate risks with multiple compliance frameworks (ISO 27001, SOC 2, NIST CSF, PCI DSS, HIPAA, GDPR, DORA, NIS 2, etc.).
- **Dashboards**: visualise your risk posture with charts and heatmaps (to be implemented).

## Project Structure

```
riskpuls/
├── pages/
│   ├── api/
│   │   └── risks.js      // REST API stub for risk data
│   ├── _app.js           // App wrapper to import global CSS
│   └── index.js          // Home page
├── components/           // Shared React components (empty for now)
├── lib/
│   └── mongo.js          // MongoDB connection helper
├── styles/
│   └── globals.css       // Tailwind base styles
├── .env.example          // Environment variables template
├── package.json          // Project metadata and dependencies
├── tailwind.config.js    // Tailwind configuration
├── postcss.config.js     // PostCSS configuration
└── README.md             // This file
```

## Getting Started

To run the project locally:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and provide your MongoDB connection string.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

Riskpuls is designed to be deployed on Vercel.  After pushing your code to GitHub, connect the repository to Vercel and set the environment variables in the Vercel dashboard.  Vercel will handle building and hosting the Next.js application.

---

*This project skeleton is part of the Riskpuls MVP.  Future development will add AI summarisation, dashboards, and integrations with external tools.*
