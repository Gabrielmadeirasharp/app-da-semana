// Confere o _site/ servido numa subpasta (como no GitHub Pages): galeria abre, app abre, sem erro 404.
// Uso: npm run build && node scripts/check-site.mjs [foto.png]
import http from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { chromium } from 'playwright'
const tipos = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' }
const srv = http.createServer((req, res) => {
  let p = join(process.cwd(), decodeURIComponent(req.url.split('?')[0]))
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html')
  if (!existsSync(p)) { res.writeHead(404); return res.end() }
  res.writeHead(200, { 'content-type': tipos[extname(p)] || 'application/octet-stream' }); res.end(readFileSync(p))
}).listen(4999)
const b = await chromium.launch()
const pg = await b.newPage({ viewport: { width: 1100, height: 900 } })
const erros = []; pg.on('pageerror', e => erros.push(e.message)); pg.on('requestfailed', r => erros.push('falhou ' + r.url()))
pg.on('response', r => r.status() >= 400 && erros.push(r.status() + ' ' + r.url()))
await pg.goto('http://localhost:4999/_site/'); await pg.waitForTimeout(800)
await pg.screenshot({ path: process.argv[2] || '_site-galeria.png' })
await pg.click('a.app'); await pg.waitForTimeout(800)
console.log('app titulo:', await pg.title(), '| h1:', await pg.textContent('h1'))
console.log('erros:', erros)
await b.close(); srv.close()
