// Camada única de dados. Hoje gera as unidades a partir de src/config (status por semente fixa).
// No produto real, getUnidades() leria o status do time comercial (planilha, Supabase, CRM) e as telas não mudam.
import marca from '../config/marca.json'
import dados from '../config/dados.json'
import calculo from '../config/calculo.json'
import mensagens from '../config/mensagens.json'
import type { Marca } from '../lib/theme'
import { gerarUnidades, type ConfigEspelho, type StatusId, type Tipologia, type Unidade } from '../lib/espelho'
import { lerSalvo, salvar } from '../lib/reset'

export type Empreendimento = typeof dados.empreendimento
export type Status = { id: StatusId; rotulo: string; cor: string }
export type Mensagens = typeof mensagens
export type Parametros = typeof calculo

// prefixo das chaves do localStorage (o ?reset=1 apaga tudo que começa com ele)
export const PREFIXO_STORAGE = 'espelho:'

const unidades = gerarUnidades(dados as ConfigEspelho)

export function getMarca(): Marca {
  return marca
}

export function getEmpreendimento(): Empreendimento {
  return dados.empreendimento
}

export function getBlocos() {
  return dados.blocos
}

export function getTipologias(): Tipologia[] {
  return dados.tipologias
}

export function getStatus(): Status[] {
  return dados.status as Status[]
}

export function corDoStatus(id: StatusId): string {
  return getStatus().find((s) => s.id === id)?.cor ?? '#999'
}

export function getUnidades(): Unidade[] {
  return unidades
}

export function getUnidade(id: string): Unidade | undefined {
  return unidades.find((u) => u.id === id)
}

export function getParametros(): Parametros {
  return calculo
}

export function getMensagens(): Mensagens {
  return mensagens
}

// o nome do corretor fica salvo para não precisar digitar de novo
export function lerCorretor(): string {
  return lerSalvo(PREFIXO_STORAGE + 'corretor', '')
}

export function salvarCorretor(nome: string): void {
  salvar(PREFIXO_STORAGE + 'corretor', nome)
}
