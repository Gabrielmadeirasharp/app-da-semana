// Camada única de dados. Alunos e faixas vêm do JSON; o check-in de hoje fica no navegador.
// No produto real, check-ins e alunos ficariam numa planilha ou Supabase e as telas não mudam.
import marca from '../config/marca.json'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import type { Marca } from '../lib/theme'
import type { Aluno, Situacao } from '../lib/tatame'
import { lerSalvo, salvar } from '../lib/reset'

export type Faixa = (typeof dados.faixas)[number]
export type Mensagens = typeof mensagens
export type Checkin = { dia: string | null; extras: number } // dia do último check-in e quantos check-ins foram feitos aqui

// prefixo das chaves do localStorage (o ?reset=1 apaga tudo que começa com ele)
export const PREFIXO_STORAGE = 'tatame:'

export function getMarca(): Marca {
  return marca
}

export function getConfig() {
  return {
    modalidade: dados.modalidade,
    aulasPorGrau: dados.aulas_por_grau,
    grausPorFaixa: dados.graus_por_faixa,
    diasParaSumido: dados.dias_para_sumido,
    valorMensalidade: dados.valor_mensalidade,
  }
}

export function getFaixas(): Faixa[] {
  return dados.faixas
}

export function getFaixa(id: string): Faixa {
  return dados.faixas.find((f) => f.id === id) ?? dados.faixas[0]
}

export function getAlunos(): Aluno[] {
  return dados.alunos as Aluno[]
}

export function getAlunoLogado(): Aluno {
  return getAlunos().find((a) => a.id === dados.aluno_logado) ?? getAlunos()[0]
}

export function getSituacao(s: Situacao) {
  return dados.situacoes[s]
}

export function getMensagens(): Mensagens {
  return mensagens
}

export function lerCheckin(): Checkin {
  return lerSalvo<Checkin>(PREFIXO_STORAGE + 'checkin', { dia: null, extras: 0 })
}

export function salvarCheckin(c: Checkin): void {
  salvar(PREFIXO_STORAGE + 'checkin', c)
}
