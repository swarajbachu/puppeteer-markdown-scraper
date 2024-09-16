// src/scraper.ts
import puppeteer from 'puppeteer';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export async function scrapeToMarkdown(url: string): Promise<string> {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL provided.');
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // Note: This flag doesn't work in Windows
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

    // Extract the main content. Customize this based on the website structure.
    const content = await page.evaluate(() => {
      // Attempt to select the <article> tag first
      const article = document.querySelector('article');
      if (article) {
        return article.innerHTML;
      }

      // Fallback to the <body> tag
      const body = document.querySelector('body');
      return body ? body.innerHTML : '';
    });

    // Convert HTML to Markdown
    const markdown = md.render(content);
    return markdown;
  } catch (error) {
    throw new Error(`Failed to scrape the URL: ${error}`);
  } finally {
    await browser.close();
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}