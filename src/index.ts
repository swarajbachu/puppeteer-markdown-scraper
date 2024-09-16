// src/index.ts
import express, { Request, Response } from 'express';
import { scrapeToMarkdown } from './scraper';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Puppeteer Markdown Scraper is running.');
});

// API Endpoint to Scrape and Convert to Markdown
app.post('/scrape', async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required in the request body.' });
  }

  try {
    const markdown = await scrapeToMarkdown(url);
    res.json({ markdown });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
