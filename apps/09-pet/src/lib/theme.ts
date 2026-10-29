// Aplica a identidade do cliente (marca.json) no app inteiro: cores, fontes e título
export type Marca = {
  nome: string
  slogan?: string
  logo: string
  whatsapp: string
  cidade?: string
  cores: Record<string, string>
  fontes: { titulo: string; corpo: string }
}

export function aplicarTema(marca: Marca): void {
  const raiz = document.documentElement
  // cada cor vira uma variável CSS: cores.primaria -> --cor-primaria (usada no Tailwind como bg-primaria)
  Object.entries(marca.cores).forEach(([nome, valor]) => raiz.style.setProperty(`--cor-${nome}`, valor))
  raiz.style.setProperty('--fonte-titulo', `'${marca.fontes.titulo}', system-ui, sans-serif`)
  raiz.style.setProperty('--fonte-corpo', `'${marca.fontes.corpo}', system-ui, sans-serif`)

  // carrega as fontes do Google Fonts escolhidas no config
  const familias = [...new Set([marca.fontes.titulo, marca.fontes.corpo])]
    .map((f) => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`)
    .join('&')
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?${familias}&display=swap`
  document.head.appendChild(link)

  document.title = marca.slogan ? `${marca.nome} · ${marca.slogan}` : marca.nome
  const meta = document.createElement('meta')
  meta.name = 'theme-color'
  meta.content = marca.cores.fundo ?? '#ffffff'
  document.head.appendChild(meta)
}
