// Camada única de dados. Hoje lê os JSON de src/config.
// Para usar a agenda real do buffet (planilha, Supabase), troque getDatasConcorridas() e as telas não mudam.
import marca from '../config/marca.json'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import type { Marca } from '../lib/theme'
import type { Extra, Pacote } from '../lib/festa'

export type Tipo = (typeof dados.tipos)[number]
export type Tema = (typeof dados.temas)[number]
export type Mensagens = typeof mensagens

// prefixo das chaves do localStorage (o ?reset=1 apaga tudo que começa com ele)
export const PREFIXO_STORAGE = 'festa:'

export function getMarca(): Marca {
  return marca
}

export function getLocal(): string {
  return dados.local
}

export function getTipos(): Tipo[] {
  return dados.tipos
}

export function getConvidadosPadrao() {
  return dados.convidados_padrao
}

export function getPacotes(): Pacote[] {
  return dados.pacotes as Pacote[]
}

export function getTemas(tipo?: string): Tema[] {
  return tipo ? dados.temas.filter((t) => t.tipos.includes(tipo)) : dados.temas
}

export function getExtras(): Extra[] {
  return dados.extras as Extra[]
}

export function getDatasConcorridas() {
  return dados.datas_concorridas
}

export function getMensagens(): Mensagens {
  return mensagens
}
