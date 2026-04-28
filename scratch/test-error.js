import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';

async function run() {
  console.log('Starting preview server...');
  const server = spawn('npm', ['run', 'preview'], { shell: true });
  
  server.stdout.on('data', (data) => console.log(`preview: ${data}`));
  server.stderr.on('data', (data) => console.error(`preview error: ${data}`));

  // Wait for server to start
  await new Promise(r => setTimeout(r, 4000));

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.log('\n\n--- PAGE ERROR CAUGHT ---');
    console.log(err.message);
    console.log(err.stack);
    console.log('-------------------------\n\n');
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  const url = 'http://localhost:4173/passeio/123';
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
  } catch (e) {
    console.log('Goto error:', e.message);
  }
  
  await page.waitForTimeout(2000);
  await browser.close();
  server.kill();
  process.exit(0);
}
run().catch(console.error);
