// Camada única de dados. Hoje lê os JSON de src/config e simula a agenda.
// Para usar a agenda real dos carros (planilha, Supabase), troque getAgenda() e as telas não mudam.
import marca from '../config/marca.json'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import type { Marca } from '../lib/theme'
import { agenda, type Destino, type Dia, type Extra, type Zona } from '../lib/passeios'

export type Mensagens = typeof mensagens

// prefixo das chaves do localStorage (o ?reset=1 apaga tudo que começa com ele)
export const PREFIXO_STORAGE = 'passeios:'

export function getMarca(): Marca {
  return marca
}

export function getDestinos(): Destino[] {
  return dados.destinos
}

export function getDestino(id: string): Destino | undefined {
  return dados.destinos.find((d) => d.id === id)
}

export function getExtras(): Extra[] {
  return dados.extras as Extra[]
}

export function getZonas(): Zona[] {
  return dados.zonas_busca
}

export function getPontoSaida(): string {
  return dados.ponto_saida
}

export function getAgenda(d: Destino): Dia[] {
  return agenda(d, new Date(), dados.dias_mostrados)
}

export function getMensagens(): Mensagens {
  return mensagens
}
