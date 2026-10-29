// Monta a mensagem a partir de um template do config e gera o link do WhatsApp

/** Troca {chave} pelo valor. Chave sem valor vira texto vazio. */
export function preencherTemplate(template: string, vars: Record<string, string | number>): string {
  return template
    .replace(/\{(\w+)\}/g, (_, chave: string) => (chave in vars ? String(vars[chave]) : ''))
    .replace(/[ \t]+$/gm, '') // tira espaço sobrando no fim das linhas
    .trim()
}

/** https://wa.me/5585999999999?text=... */
export function linkWhatsApp(numero: string, texto: string): string {
  const soDigitos = numero.replace(/\D/g, '')
  return `https://wa.me/${soDigitos}?text=${encodeURIComponent(texto)}`
}

/** Abre o WhatsApp numa nova aba (no celular abre o app direto) */
export function abrirWhatsApp(numero: string, texto: string): void {
  window.open(linkWhatsApp(numero, texto), '_blank', 'noopener')
}
