// Camada única de dados. Hoje as ordens de serviço vêm do JSON e o andamento fica no navegador.
// No produto real, a oficina atualiza etapa e achados num painel (planilha, Supabase) e as telas não mudam.
import marca from '../config/marca.json'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import type { Marca } from '../lib/theme'
import type { CorAchado, Decisoes, Ordem } from '../lib/oficina'
import { lerSalvo, salvar } from '../lib/reset'

export type Mensagens = typeof mensagens
export type Andamento = { etapa: string; decisoes: Decisoes; aprovacaoEnviada: boolean }

// prefixo das chaves do localStorage (o ?reset=1 apaga tudo que começa com ele)
export const PREFIXO_STORAGE = 'oficina:'

export function getMarca(): Marca {
  return marca
}

export function getEndereco(): string {
  return dados.endereco
}

export function getAvaliacaoGoogle(): string {
  return dados.avaliacao_google
}

export function getEtapas() {
  return dados.etapas
}

export function getCorAchado(cor: CorAchado) {
  return dados.cores_achado[cor]
}

/** OS escolhida por ?os=1234 (se não achar, mostra a primeira, para a demo nunca ficar vazia) */
export function getOrdem(numero: string): Ordem {
  const ordens = dados.ordens as Ordem[]
  return ordens.find((o) => o.os === numero) ?? ordens[0]
}

export function getMensagens(): Mensagens {
  return mensagens
}

export function lerAndamento(o: Ordem): Andamento {
  return lerSalvo<Andamento>(`${PREFIXO_STORAGE}os:${o.os}`, { etapa: o.etapa_inicial, decisoes: {}, aprovacaoEnviada: false })
}

export function salvarAndamento(o: Ordem, a: Andamento): void {
  salvar(`${PREFIXO_STORAGE}os:${o.os}`, a)
}
