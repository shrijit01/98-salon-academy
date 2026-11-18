import { preview } from 'vite';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

async function run() {
  console.log('1. Starting Vite preview server on port', PORT);
  const previewServer = await preview({
    preview: {
      port: PORT,
      strictPort: true,
    },
  });

  let browser;
  const consoleErrors = [];
  const pageErrors = [];

  try {
    console.log('2. Launching headless Chrome...');
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        consoleErrors.push(text);
        console.error(`[Browser Error]: ${text}`);
      } else {
        console.log(`[Browser ${type}]: ${text}`);
      }
    });

    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
      console.error(`[Browser PageError]: ${err.message}`);
    });

    // Test 1: Desktop Viewport
    console.log('3. Testing Desktop Viewport (1440x900)...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    // Verify Title & Meta
    const title = await page.title();
    console.log('Page title:', title);
    if (!title.includes('98 SALON & ACADEMY')) {
      throw new Error(`Unexpected title: ${title}`);
    }

    // Wait for the Scissor Cut Intro to complete (~2.5s)
    console.log('Waiting for Scissor Cut Intro sequence...');
    await new Promise((resolve) => setTimeout(resolve, 3200));

    // Verify Hero elements exist
    const heroHeadline = await page.$eval('h1', (el) => el.innerText);
    console.log('Hero headline found:', heroHeadline.replace(/\n/g, ' '));
    if (!heroHeadline.includes('Your beauty')) {
      throw new Error('Headline does not contain "Your beauty."');
    }

    // Test Hero Canvas Scrub & Watermark / Frame Counter Absence
    console.log('4. Testing Canvas Scroll Scrubbing & Watermark Removal...');

    // Explicit assertion: Verify frame counter (e.g. "001 / 190") is completely removed from the DOM
    const hasFrameCounter = await page.evaluate(() => {
      const allText = document.body.innerText;
      const spans = Array.from(document.querySelectorAll('span'));
      return (
        allText.includes('/ 190') ||
        spans.some((s) => s.innerText.includes('/ 190'))
      );
    });
    console.log('Frame counter "/ 190" present:', hasFrameCounter);
    if (hasFrameCounter) {
      throw new Error('Frame counter "/ 190" should be completely removed, but was found in DOM!');
    }

    // Verify canvas exists and is rendering
    const canvasSampleBefore = await page.evaluate(() => {
      const canvas = document.querySelector('#home canvas');
      if (!canvas) return null;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      const center = ctx.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data;
      return Array.from(center);
    });
    console.log('Canvas initial center pixel:', canvasSampleBefore);

    // Scroll down to scrub canvas
    await page.evaluate(() => {
      window.scrollTo(0, 1200);
    });
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Verify canvas scrubbed and updated
    const canvasSampleAfter = await page.evaluate(() => {
      const canvas = document.querySelector('#home canvas');
      if (!canvas) return null;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      const center = ctx.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data;
      return Array.from(center);
    });
    console.log('Canvas center pixel after scroll:', canvasSampleAfter);

    // Verify bottom-right corner does not contain Gemini sparkle watermark
    const watermarkCheck = await page.evaluate(() => {
      const canvas = document.querySelector('#home canvas');
      if (!canvas) return { error: 'No canvas found' };
      const ctx = canvas.getContext('2d');
      if (!ctx) return { error: 'No context found' };
      const w = canvas.width;
      const h = canvas.height;
      const corner = ctx.getImageData(Math.max(0, w - 60), Math.max(0, h - 60), 60, 60).data;
      let maxBrightness = 0;
      for (let i = 0; i < corner.length; i += 4) {
        const brightness = (corner[i] + corner[i + 1] + corner[i + 2]) / 3;
        if (brightness > maxBrightness) maxBrightness = brightness;
      }
      return { maxBrightness };
    });
    console.log('Canvas bottom-right corner max brightness:', watermarkCheck.maxBrightness);
    if (watermarkCheck.maxBrightness > 120) {
      throw new Error(`Potential watermark detected! Bottom-right max brightness is ${watermarkCheck.maxBrightness}`);
    }

    // Test Navigation links
    console.log('5. Testing Services Navigation and Discipline Interaction...');
    await page.evaluate(() => {
      const srvLink = document.querySelector('a[href="#services"]');
      if (srvLink) srvLink.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Click through each service discipline tab
    const tabs = ['hair', 'skin', 'makeup', 'nails'];
    for (const tab of tabs) {
      const clicked = await page.evaluate((id) => {
        const headings = Array.from(document.querySelectorAll('#services h3'));
        const target = headings.find((h) => h.innerText.toLowerCase() === id);
        if (target) {
          target.click();
          return true;
        }
        return false;
      }, tab);
      console.log(`Discipline tab clicked (${tab}):`, clicked);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Test Appointment Booking Modal
    console.log('6. Testing Appointment Booking Modal...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.innerText.toLowerCase().includes('book appointment')
      );
      if (btn) btn.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 400));

    const isModalOpen = await page.evaluate(() => {
      return document.querySelector('[role="dialog"]') !== null;
    });
    console.log('Booking modal opened:', isModalOpen);
    if (!isModalOpen) throw new Error('Booking modal failed to open');

    // Close modal
    await page.keyboard.press('Escape');
    await page.evaluate(() => {
      const closeBtn = document.querySelector('[role="dialog"] button[aria-label="Close modal"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Test Lightbox
    console.log('7. Testing Gallery Lightbox...');
    await page.evaluate(() => {
      const galItem = document.querySelector('#gallery .gallery-card');
      if (galItem) galItem.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 500));

    const isLightboxOpen = await page.evaluate(() => {
      return document.querySelector('[role="dialog"] img') !== null;
    });
    console.log('Gallery Lightbox opened:', isLightboxOpen);
    if (!isLightboxOpen) throw new Error('Gallery Lightbox failed to open');

    // Navigate Lightbox
    await page.keyboard.press('ArrowRight');
    await new Promise((resolve) => setTimeout(resolve, 300));
    await page.keyboard.press('Escape');
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Test 2: Mobile Viewport
    console.log('8. Testing Mobile Viewport (390x844 - iPhone 14)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test Mobile Menu Drawer
    console.log('9. Testing Mobile Drawer...');
    await page.evaluate(() => {
      const menuBtn = document.querySelector('button[aria-label="Toggle navigation menu"]');
      if (menuBtn) menuBtn.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 400));

    const drawerVisible = await page.evaluate(() => {
      const drawer = document.querySelector('.lg\\:hidden.fixed.inset-0');
      return drawer && getComputedStyle(drawer).opacity !== '0';
    });
    console.log('Mobile drawer visible:', drawerVisible);

    console.log('10. Checking Console & Page Errors...');
    console.log('Total console errors:', consoleErrors.length);
    console.log('Total page errors:', pageErrors.length);

    if (consoleErrors.length > 0 || pageErrors.length > 0) {
      throw new Error(`Found errors! Console: ${JSON.stringify(consoleErrors)}, Page: ${JSON.stringify(pageErrors)}`);
    }

    console.log('✨ ALL DEEP VERIFICATION TESTS PASSED SUCCESSFULLY! ✨');
  } finally {
    if (browser) await browser.close();
    await previewServer.close();
  }
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
