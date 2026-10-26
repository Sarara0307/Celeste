/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = '0.0.0.0';

  app.use(express.json());

  // API endpoint for AI Financial Coach powered by Gemini
  app.post('/api/coach', async (req, res) => {
    try {
      const { question, summary, settings, jars } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
        return res.status(200).json({
          answer: null,
          message: 'No GEMINI_API_KEY configured',
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are SaveSense AI financial coach. The user asks: "${question}".
Live User Data:
- Monthly Income: ₹${((settings?.monthlyIncomePaise || 0) / 100).toLocaleString('en-IN')}
- Available Liquid Balance: ₹${((summary?.currentAvailableBalancePaise || 0) / 100).toLocaleString('en-IN')}
- Signature Safe-to-Spend Balance: ₹${((summary?.spendableBalancePaise || 0) / 100).toLocaleString('en-IN')}
- Suggested Daily Allowance: ₹${((summary?.suggestedDailyAllowancePaise || 0) / 100).toLocaleString('en-IN')} / day (${summary?.daysRemainingUntilIncome || 30} days remaining)
- Unpaid Essential Bills: ₹${((summary?.unpaidEssentialBillsPaise || 0) / 100).toLocaleString('en-IN')}
- Planned Monthly Savings: ₹${((summary?.plannedSavingsMonthlyPaise || 0) / 100).toLocaleString('en-IN')}
- Emergency Reserve: ₹${((summary?.emergencyReservePaise || 0) / 100).toLocaleString('en-IN')}
- Active Goals: ${Array.isArray(jars) ? jars.map((j: any) => `${j.name}: ₹${((j.savedPaise || 0) / 100).toLocaleString('en-IN')} of ₹${((j.targetPaise || 0) / 100).toLocaleString('en-IN')}`).join(', ') : 'None'}

Provide a concise, practical, empathetic answer in under 120 words. No banking jargon. Give 2 practical action steps.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      return res.json({ answer: text });
    } catch (error: any) {
      console.error('Gemini coach API error:', error);
      return res.status(500).json({ error: 'Failed to generate coach advice' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'SaveSense' });
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, HOST, () => {
    console.log(`SaveSense server running on http://${HOST}:${PORT}`);
  });
}

startServer();
