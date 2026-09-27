const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { chromium } = require('playwright');

const gamePath = join(__dirname, '..', 'index.html');

test('inline game JavaScript parses', async () => {
  const html = await readFile(gamePath, 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, 'index.html contains the game script');
  new (require('node:vm').Script)(script, { filename: 'index.html' });
});

test('game loads and runs from the GitHub Pages path at desktop and phone widths', async () => {
  const html = await readFile(gamePath);
  const server = createServer((request, response) => {
    if (request.url === '/favicon.ico' || request.url === '/cone_catcher/favicon.ico') {
      response.writeHead(204).end();
      return;
    }
    if (request.url !== '/cone_catcher/' && request.url !== '/cone_catcher/index.html') {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;

  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error') errors.push(message.text());
      });

      const url = `http://127.0.0.1:${server.address().port}/cone_catcher/`;
      const response = await page.goto(url);
      assert.equal(response.status(), 200);
      assert.equal(await page.title(), 'Cone Catcher');
      assert.ok(await page.locator('#game').evaluate(canvas => canvas.width > 0 && canvas.height > 0));
      await page.locator('#start').click();
      assert.equal(await page.locator('#pause').isEnabled(), true);
      await page.locator('#pause').click();
      assert.equal(await page.locator('#pause').textContent(), 'Resume');
      await page.locator('#pause').click();
      assert.equal(await page.locator('#pause').textContent(), 'Pause');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'page fits viewport width');
      assert.deepEqual(errors, [], `browser errors at ${viewport.width}px`);
      await page.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
