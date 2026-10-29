// Builda todos os apps marcados como "pronto" em apps.json e monta a pasta _site/ (o que vai para o GitHub Pages):
//   _site/index.html      galeria
//   _site/<slug>/         cada app
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const apps = JSON.parse(readFileSync('apps.json', 'utf8'))
const prontos = apps.filter((a) => a.pronto)
rmSync('_site', { recursive: true, force: true })
mkdirSync('_site/capas', { recursive: true })

for (const app of prontos) {
  const pasta = `apps/${app.pasta}`
  if (!existsSync(pasta)) throw new Error(`apps.json marca ${app.pasta} como pronto, mas a pasta não existe`)
  console.log(`\n▸ ${app.pasta} → /${app.slug}/`)
  execSync(`npm run build -w ${pasta}`, { stdio: 'inherit' })
  cpSync(`${pasta}/dist`, `_site/${app.slug}`, { recursive: true })
  const capa = primeiraTela(pasta)
  if (capa) cpSync(`${pasta}/docs/${capa}`, `_site/capas/${app.slug}.png`)
}

// galeria: troca <!--APPS--> do index.html pelos cartões
const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const cartoes = apps
  .map((a, i) => {
    const num = String(i + 1).padStart(2, '0')
    const capa = a.pronto && primeiraTela(`apps/${a.pasta}`) ? `capas/${a.slug}.png` : ''
    const corpo = `
      <div class="capa">${capa ? `<img src="${capa}" alt="" loading="lazy">` : '<span>em breve</span>'}</div>
      <span class="num">${num}</span>
      <span class="titulo">${escapar(a.titulo)}</span>
      <span class="nicho">${escapar(a.nicho)}${a.marca ? ` · ${escapar(a.marca)}` : ''}</span>
      <span class="palavra">palavra <b>${a.palavra}</b></span>`
    return a.pronto ? `<a class="app" href="${a.slug}/">${corpo}</a>` : `<div class="app breve">${corpo}</div>`
  })
  .join('\n')
writeFileSync('_site/index.html', readFileSync('index.html', 'utf8').replace('<!--APPS-->', cartoes))
writeFileSync('_site/.nojekyll', '')
console.log(`\n✓ _site/ pronto com ${prontos.length} app(s)`)

function primeiraTela(pasta) {
  const docs = `${pasta}/docs`
  return existsSync(docs) ? (readdirSync(docs).find((f) => /^1-.*\.png$/.test(f)) ?? '') : ''
}
