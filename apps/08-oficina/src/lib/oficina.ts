// Regras da inspeção digital (DVI): etapas da OS, aprovação item a item e totais. Funções puras.
import { moeda } from './format'
import { preencherTemplate } from './whatsapp'

export type CorAchado = 'vermelho' | 'amarelo' | 'verde'
export type Achado = { id: string; titulo: string; cor: CorAchado; nota: string; foto: string; peca: number; mao_obra: number }
export type Ordem = {
  os: string
  cliente: string
  carro: string
  placa: string
  km: number
  entrada: string
  etapa_inicial: string
  previsao_pronto: string
  achados: Achado[]
}
export type Decisao = 'aprovado' | 'recusado'
export type Decisoes = Record<string, Decisao>

export const ORDEM_CORES: CorAchado[] = ['vermelho', 'amarelo', 'verde']

export function valorAchado(a: Achado): number {
  return a.peca + a.mao_obra
}

/** Itens que pedem decisão do cliente (verde não tem custo) */
export function itensComCusto(achados: Achado[]): Achado[] {
  return achados.filter((a) => a.cor !== 'verde' && valorAchado(a) > 0)
}

export function totalAprovado(achados: Achado[], d: Decisoes): number {
  return achados.filter((a) => d[a.id] === 'aprovado').reduce((s, a) => s + valorAchado(a), 0)
}

export function todosDecididos(achados: Achado[], d: Decisoes): boolean {
  return itensComCusto(achados).every((a) => d[a.id])
}

/** Próxima etapa da OS (fica na última se já chegou) */
export function proximaEtapa(etapas: string[], atual: string): string {
  const i = etapas.indexOf(atual)
  return etapas[Math.min(etapas.length - 1, i + 1)] ?? atual
}

/** Placa no formato Mercosul com hífen para leitura: QXB4E21 → QXB-4E21 */
export function formatarPlaca(p: string): string {
  return p.length === 7 ? `${p.slice(0, 3)}-${p.slice(3)}` : p
}

export function montarMensagemAprovacao(template: string, nenhum: string, o: Ordem, d: Decisoes): string {
  const itens = itensComCusto(o.achados)
  const lista = (dec: Decisao) => itens.filter((a) => d[a.id] === dec).map((a) => a.titulo.toLowerCase()).join(', ') || nenhum
  return preencherTemplate(template, {
    os: o.os,
    carro: o.carro,
    placa: formatarPlaca(o.placa),
    itens_aprovados: lista('aprovado'),
    itens_recusados: lista('recusado'),
    total: moeda(totalAprovado(o.achados, d)),
  })
}
