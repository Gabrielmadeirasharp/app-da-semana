// Regras do guia: hóspede vindo da URL, idioma e mensagens para a recepção. Funções puras.
import { preencherTemplate } from './whatsapp'

export type Idioma = 'pt' | 'en'
export type Texto = Record<Idioma, string>

export type Hospede = { nome: string; quarto: string; ultimoDia: boolean }

/**
 * Lê o hóspede da URL, sem banco de dados: ?h=Ana&q=12
 * Último dia: ?saida=AAAA-MM-DD (mostra o convite de avaliação nesse dia) ou ?ultimo=1 (para a demo).
 */
export function lerHospede(busca: string, hoje: Date): Hospede {
  const p = new URLSearchParams(busca)
  const saida = p.get('saida')
  const hojeIso = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
  return {
    nome: (p.get('h') ?? '').trim().slice(0, 40),
    quarto: (p.get('q') ?? '').trim().slice(0, 10),
    ultimoDia: p.get('ultimo') === '1' || (!!saida && saida <= hojeIso),
  }
}

/** Pega o texto no idioma escolhido (cai no português se faltar tradução) */
export function t(texto: Texto | string, idioma: Idioma): string {
  return typeof texto === 'string' ? texto : (texto[idioma] ?? texto.pt)
}

export function mensagemPedido(template: string, hospede: { nome: string; quarto: string }, pedido: string, detalhes = ''): string {
  return preencherTemplate(template, {
    nome: hospede.nome || '-',
    quarto: hospede.quarto || '-',
    pedido,
    detalhes,
  })
}

/** https://www.google.com/maps/search/?api=1&query=lat,lng */
export function linkMapa(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}
