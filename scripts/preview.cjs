const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { join } = require('node:path');
const { parseArgs } = require('node:util');

// Serve the same prefix as GitHub Pages; expose only the game, not other local files.
function createPreviewServer(html) {
  return createServer(async (request, response) => {
    if (request.url === '/favicon.ico' || request.url === '/cone_catcher/favicon.ico') {
      response.writeHead(204).end();
      return;
    }
    if (request.url === '/') {
      response.writeHead(302, { location: '/cone_catcher/' }).end();
      return;
    }
    if (request.url !== '/cone_catcher/' && request.url !== '/cone_catcher/index.html') {
      response.writeHead(404).end();
      return;
    }
    try {
      const content = html ?? await readFile(join(__dirname, '..', 'index.html'));
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(content);
    } catch {
      response.writeHead(500).end('Unable to read the game.');
    }
  });
}

if (require.main === module) {
  const { values } = parseArgs({ options: {
    host: { type: 'string', default: '127.0.0.1' },
    port: { type: 'string', default: '4173' }
  } });
  const server = createPreviewServer();
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(Number(values.port), values.host, () => {
    console.log(`Cone Catcher: http://${values.host}:${server.address().port}/cone_catcher/`);
  });
}

module.exports = { createPreviewServer };
