// Gera screenshots 390 x 844 de um app e confere a mensagem do WhatsApp do fluxo do vídeo.
// Uso: npm run screens -- 01-solar
// Cada app descreve o próprio roteiro em apps/<app>/docs/roteiro.mjs (export default async ({ page, foto }) => {...})
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const app = process.argv[2]
if (!app) {
  console.error('Informe o app: npm run screens -- 01-solar')
  process.exit(1)
}
const pasta = resolve('apps', app)
const porta = 4800 + Math.floor(Math.random() * 100)

// 1. build e servidor de preview
await rodar('npm', ['run', 'build', '-w', `apps/${app}`])
const servidor = spawn('npx', ['vite', 'preview', '--port', String(porta), '--strictPort'], { cwd: pasta, shell: true })
await esperarServidor(`http://localhost:${porta}/`)

// 2. navegador com tela de celular
const navegador = await chromium.launch()
const contexto = await navegador.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: 'pt-BR',
})
const page = await contexto.newPage()
const erros = []
page.on('pageerror', (e) => erros.push(e.message))
page.on('console', (m) => m.type() === 'error' && erros.push(m.text()))

// window.open do WhatsApp vira registro (não abre aba)
const mensagens = []
await page.exposeFunction('__registrarWhatsApp', (url) => mensagens.push(url))
await page.addInitScript(() => {
  window.open = (url) => {
    window.__registrarWhatsApp(String(url))
    return null
  }
})

const base = `http://localhost:${porta}/`
const foto = async (nome) => {
  await page.waitForTimeout(400) // espera as transições
  await page.screenshot({ path: join(pasta, 'docs', `${nome}.png`) })
  console.log('  foto', nome)
}

try {
  const roteiro = (await import(pathToFileURL(join(pasta, 'docs', 'roteiro.mjs')).href)).default
  await roteiro({ page, foto, base })
} finally {
  await navegador.close()
  servidor.kill()
  if (process.platform === 'win32') spawn('taskkill', ['/pid', String(servidor.pid), '/T', '/F'])
}

// 3. confere a mensagem
const saida = mensagens.map((url) => {
  const u = new URL(url)
  return `${url.split('?')[0]}\n\n${u.searchParams.get('text')}`
})
writeFileSync(join(pasta, 'docs', 'mensagem-whatsapp.txt'), saida.join('\n\n---\n\n') + '\n')
console.log('\nMensagens geradas:\n')
console.log(saida.join('\n\n---\n\n') || '(nenhuma)')
if (erros.length) {
  console.log('\nErros no console:\n' + erros.join('\n'))
  process.exitCode = 1
}

function rodar(cmd, args) {
  return new Promise((ok, falha) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true })
    p.on('exit', (c) => (c === 0 ? ok() : falha(new Error(`${cmd} ${args.join(' ')} saiu com ${c}`))))
  })
}

async function esperarServidor(url) {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(url)
      if (r.ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('servidor não subiu: ' + url)
}
