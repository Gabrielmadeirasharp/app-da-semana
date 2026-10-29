// Camada única de dados. Hoje lê os JSON de src/config.
// Para usar Supabase ou Google Sheets no futuro, troque o corpo destas funções (as telas não mudam).
import marca from '../config/marca.json'
import dados from '../config/dados.json'
import calculo from '../config/calculo.json'
import mensagens from '../config/mensagens.json'
import type { Marca } from '../lib/theme'
import type { ParametrosSolar } from '../lib/solar'

export type DadosSolar = typeof dados
export type Mensagens = typeof mensagens

export const PREFIXO_STORAGE = 'solar:'

export function getMarca(): Marca {
  return marca
}

export function getDados(): DadosSolar {
  return dados
}

export function getParametros(): ParametrosSolar {
  return calculo
}

export function getMensagens(): Mensagens {
  return mensagens
}
