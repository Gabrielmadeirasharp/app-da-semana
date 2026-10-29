// Camada única de dados. Hoje lê os JSON de src/config.
// Para usar Supabase ou Google Sheets no futuro, troque o corpo destas funções (as telas não mudam).
import marca from '../config/marca.json'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import type { Marca } from '../lib/theme'

export type Dados = typeof dados
export type Mensagens = typeof mensagens

// prefixo das chaves do localStorage (o ?reset=1 apaga tudo que começa com ele)
export const PREFIXO_STORAGE = 'modelo:'

export function getMarca(): Marca {
  return marca
}

export function getDados(): Dados {
  return dados
}

export function getMensagens(): Mensagens {
  return mensagens
}
