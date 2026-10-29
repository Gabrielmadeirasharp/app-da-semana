// Camada única de dados. Pets, serviços e pacote vêm do JSON; o andamento fica no navegador.
// No produto real, o pet shop atualiza a etapa do banho e manda a foto (planilha, Supabase) e as telas não mudam.
import marca from '../config/marca.json'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import type { Marca } from '../lib/theme'
import type { Pet, Porte, Servico } from '../lib/pet'
import { lerSalvo, salvar } from '../lib/reset'

export type Mensagens = typeof mensagens
export type Agendamento = { petId: string; servicoId: string; dia: string; hora: string; etapa: number }
export type Estado = { agendamento: Agendamento | null; usados: number; ultimoBanho: string | null }

// prefixo das chaves do localStorage (o ?reset=1 apaga tudo que começa com ele)
export const PREFIXO_STORAGE = 'pet:'

export function getMarca(): Marca {
  return marca
}

export function getEndereco(): string {
  return dados.endereco
}

export function rotuloPorte(p: Porte): string {
  return dados.portes[p]
}

export function getPets(): Pet[] {
  return dados.pets as Pet[]
}

export function getServicos(): Servico[] {
  return dados.servicos
}

export function getAgendaConfig() {
  return dados.agenda
}

export function getEtapasBanho(): string[] {
  return dados.etapas_banho
}

export function getReport() {
  return dados.report
}

export function getPacote() {
  return dados.pacote
}

export function getMensagens(): Mensagens {
  return mensagens
}

export function lerEstado(): Estado {
  return lerSalvo<Estado>(PREFIXO_STORAGE + 'estado', { agendamento: null, usados: dados.pacote.usados_inicio, ultimoBanho: null })
}

export function salvarEstado(e: Estado): void {
  salvar(PREFIXO_STORAGE + 'estado', e)
}
