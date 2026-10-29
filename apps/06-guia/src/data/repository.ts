// Camada única de dados. Hoje lê os JSON de src/config; idioma escolhido fica no navegador.
// Para o dono da pousada editar sozinho (planilha, Supabase), troque o corpo destas funções.
import marca from '../config/marca.json'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import idiomas from '../config/idiomas.json'
import type { Marca } from '../lib/theme'
import type { Idioma } from '../lib/guia'
import { lerSalvo, salvar } from '../lib/reset'

export type Dados = typeof dados
export type Mensagens = typeof mensagens
export type Rotulos = typeof idiomas.pt

// prefixo das chaves do localStorage (o ?reset=1 apaga tudo que começa com ele)
export const PREFIXO_STORAGE = 'guia:'

export function getMarca(): Marca {
  return marca
}

export function getDados(): Dados {
  return dados
}

export function getMensagens(): Mensagens {
  return mensagens
}

export function getRotulos(idioma: Idioma): Rotulos {
  return idiomas[idioma]
}

export function lerIdioma(): Idioma {
  const daUrl = new URLSearchParams(location.search).get('lang')
  if (daUrl === 'en' || daUrl === 'pt') return daUrl
  return lerSalvo<Idioma>(PREFIXO_STORAGE + 'idioma', 'pt')
}

export function salvarIdioma(i: Idioma): void {
  salvar(PREFIXO_STORAGE + 'idioma', i)
}
