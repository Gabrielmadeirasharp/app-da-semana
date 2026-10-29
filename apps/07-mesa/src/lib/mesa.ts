// Regras do pedido na mesa: carrinho, rodadas, repetir bebidas e dividir a conta. Funções puras.
import { moeda } from './format'
import { preencherTemplate } from './whatsapp'

export type ItemCardapio = {
  id: string
  nome: string
  descricao: string
  preco: number
  categoria: string
  icone: string
  cor: string
  bebida?: boolean
}
export type Linha = { id: string; qtd: number }
export type Rodada = { hora: string; itens: Linha[] }

/** ?mesa=12 → "12" (só número ou texto curto, para não quebrar a mensagem) */
export function lerMesa(busca: string): string {
  const m = new URLSearchParams(busca).get('mesa') ?? ''
  return m.replace(/[^\w-]/g, '').slice(0, 6)
}

export function somarItem(linhas: Linha[], id: string, delta: number): Linha[] {
  const existe = linhas.find((l) => l.id === id)
  const novas = existe ? linhas.map((l) => (l.id === id ? { ...l, qtd: l.qtd + delta } : l)) : [...linhas, { id, qtd: delta }]
  return novas.filter((l) => l.qtd > 0)
}

export function totalLinhas(linhas: Linha[], cardapio: ItemCardapio[]): number {
  return linhas.reduce((s, l) => s + (cardapio.find((c) => c.id === l.id)?.preco ?? 0) * l.qtd, 0)
}

/** Bebidas da última rodada: o botão "Repetir última rodada" coloca só elas no carrinho */
export function bebidasDaUltimaRodada(rodadas: Rodada[], cardapio: ItemCardapio[]): Linha[] {
  const ultima = rodadas[rodadas.length - 1]
  if (!ultima) return []
  return ultima.itens.filter((l) => cardapio.find((c) => c.id === l.id)?.bebida)
}

/** Junta todas as rodadas da mesa num consumo só (mesmo item somado) */
export function consumoDaMesa(rodadas: Rodada[]): Linha[] {
  return rodadas.flatMap((r) => r.itens).reduce<Linha[]>((acc, l) => somarItem(acc, l.id, l.qtd), [])
}

export function totalComServico(subtotal: number, taxa: number): { servico: number; total: number } {
  const servico = Math.round(subtotal * taxa * 100) / 100
  return { servico, total: subtotal + servico }
}

/** Divide igualmente; os centavos que sobram ficam com a primeira pessoa */
export function dividirIgual(total: number, pessoas: number): number[] {
  const centavos = Math.round(total * 100)
  const base = Math.floor(centavos / pessoas)
  return Array.from({ length: pessoas }, (_, i) => (base + (i === 0 ? centavos - base * pessoas : 0)) / 100)
}

export function montarMensagemPedido(t: { pedido: string; item: string }, mesa: string, linhas: Linha[], cardapio: ItemCardapio[]): string {
  const itens = linhas
    .map((l) => {
      const c = cardapio.find((x) => x.id === l.id)
      return c ? preencherTemplate(t.item, { qtd: l.qtd, nome: c.nome, valor: moeda(c.preco * l.qtd) }) : ''
    })
    .filter(Boolean)
    .join('\n')
  return preencherTemplate(t.pedido, { mesa, itens, total: moeda(totalLinhas(linhas, cardapio)) })
}

export function horaAgora(d = new Date()): string {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
