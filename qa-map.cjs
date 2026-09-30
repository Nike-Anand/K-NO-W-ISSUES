/* Temporary QA harness: verifies the OpenStreetMap canvas renders in-browser. */
const puppeteer = require('puppeteer-core');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://127.0.0.1:5199/';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const errors = [];
  const tileStatus = { ok: 0, failed: 0 };
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text());
  });
  page.on('response', (r) => {
    if (r.url().includes('tile.openstreetmap.org')) {
      r.ok() ? tileStatus.ok++ : tileStatus.failed++;
    }
  });

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });

  // Navigate to the Explore map view.
  await page.evaluate(() => {
    const el = [...document.querySelectorAll('button, a')].find((n) =>
      /explore\s*map/i.test(n.textContent || '')
    );
    if (el) el.click();
  });

  await page.waitForSelector('.leaflet-container', { timeout: 20000 });
  await page.waitForSelector('.ld-map-pin', { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 3500)); // let tiles paint

  const light = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute('data-theme'),
    tiles: document.querySelectorAll('.leaflet-tile').length,
    pins: document.querySelectorAll('.ld-map-pin').length,
    badges: document.querySelectorAll('.ld-map-pin__badge').length,
    zones: document.querySelectorAll('.leaflet-overlay-pane path').length,
    labels: [...document.querySelectorAll('.ld-map-label')].map((n) => n.textContent),
    attribution: document.querySelector('.leaflet-control-attribution')?.textContent || '',
    zoomControls: document.querySelectorAll('.leaflet-control-zoom').length,
  }));
  await page.screenshot({ path: 'qa-map-light.png' });

  // Exercise the custom zoom buttons.
  await page.evaluate(() => {
    [...document.querySelectorAll('button')]
      .find((b) => b.title === 'Zoom In')
      ?.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  const zoomAfter = await page.evaluate(() => {
    const c = document.querySelector('.leaflet-container');
    return c && c._leaflet_id ? true : false;
  });

  // Toggle to the dark color grade.
  await page.evaluate(() => {
    document.querySelector('button[aria-label="Toggle color theme"]')?.click();
  });
  await new Promise((r) => setTimeout(r, 1800));
  const dark = await page.evaluate(() => {
    const pane = document.querySelector('.ld-map-canvas .leaflet-tile-pane');
    return {
      theme: document.documentElement.getAttribute('data-theme'),
      tileFilter: pane ? getComputedStyle(pane).filter : 'none',
      pinBadgeColor: getComputedStyle(document.querySelector('.ld-map-pin__badge')).color,
    };
  });
  await page.screenshot({ path: 'qa-map-dark.png' });

  console.log(JSON.stringify({ light, zoomAfter, dark, tileStatus, errors }, null, 2));
  await browser.close();
})().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
