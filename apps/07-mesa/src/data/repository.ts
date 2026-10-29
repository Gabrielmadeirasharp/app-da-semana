// Camada única de dados. Cardápio vem do JSON; o que a mesa pediu fica no localStorage (por mesa).
// No produto real, salvarRodadas() mandaria o pedido para o caixa/cozinha e as telas não mudam.
import marca from '../config/marca.json'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import type { Marca } from '../lib/theme'
import { horaAgora, type ItemCardapio, type Linha, type Rodada } from '../lib/mesa'
import { lerSalvo, salvar } from '../lib/reset'

export type Mensagens = typeof mensagens
export type Motivo = (typeof dados.motivos_garcom)[number]

// prefixo das chaves do localStorage (o ?reset=1 apaga tudo que começa com ele)
export const PREFIXO_STORAGE = 'mesa:'

export function getMarca(): Marca {
  return marca
}

export function getCategorias() {
  return dados.categorias
}

export function getCardapio(): ItemCardapio[] {
  return dados.cardapio
}

export function getMotivos(): Motivo[] {
  return dados.motivos_garcom
}

export function getTaxaServico(): number {
  return dados.taxa_servico
}

export function getQuantidadeMesas(): number {
  return dados.mesas
}

export function getMensagens(): Mensagens {
  return mensagens
}

export function lerRodadas(mesa: string): Rodada[] {
  const salvas = lerSalvo<Rodada[]>(`${PREFIXO_STORAGE}conta:${mesa}`, [])
  // ?demo=1: a mesa já começa com uma rodada pedida, para o vídeo mostrar o "Repetir última rodada"
  if (salvas.length === 0 && new URLSearchParams(location.search).get('demo') === '1') {
    const antes = new Date(Date.now() - 35 * 60 * 1000)
    return [{ hora: horaAgora(antes), itens: dados.rodada_demo }]
  }
  return salvas
}

export function salvarRodadas(mesa: string, rodadas: Rodada[]): void {
  salvar(`${PREFIXO_STORAGE}conta:${mesa}`, rodadas)
}

export function lerCarrinho(mesa: string): Linha[] {
  return lerSalvo<Linha[]>(`${PREFIXO_STORAGE}carrinho:${mesa}`, [])
}

export function salvarCarrinho(mesa: string, linhas: Linha[]): void {
  salvar(`${PREFIXO_STORAGE}carrinho:${mesa}`, linhas)
}
