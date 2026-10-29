// Regras do tatame: progresso até o próximo grau, quem está pronto, quem sumiu e calendário do mês. Funções puras.

export type Situacao = 'em_dia' | 'vence_logo' | 'atrasada'
export type Aluno = {
  id: string
  nome: string
  faixa: string
  graus: number
  aulas_desde_grau: number
  dias_sem_treinar: number
  mensalidade: { situacao: Situacao; vence: string }
  presencas_mes?: number[]
  whatsapp: string
}

/** Progresso até o próximo grau (critério: aulas desde o último grau) */
export function progressoGrau(aulas: number, aulasPorGrau: number): { percentual: number; faltam: number; pronto: boolean } {
  return {
    percentual: Math.min(100, (aulas / aulasPorGrau) * 100),
    faltam: Math.max(0, aulasPorGrau - aulas),
    pronto: aulas >= aulasPorGrau,
  }
}

/** Com 4 graus, o próximo passo é a próxima faixa */
export function proximoPasso(faixaId: string, graus: number, faixas: { id: string; nome: string }[], grausPorFaixa: number): string {
  if (graus < grausPorFaixa) return `${graus + 1}º grau`
  const i = faixas.findIndex((f) => f.id === faixaId)
  return faixas[i + 1] ? `Faixa ${faixas[i + 1].nome.toLowerCase()}` : `${graus + 1}º grau`
}

export function prontosParaGraduar(alunos: Aluno[], aulasPorGrau: number): Aluno[] {
  return alunos.filter((a) => a.aulas_desde_grau >= aulasPorGrau)
}

/** "Sumido": sem treinar há N dias ou mais, do mais sumido para o menos */
export function sumidos(alunos: Aluno[], limiteDias: number): Aluno[] {
  return alunos.filter((a) => a.dias_sem_treinar >= limiteDias).sort((a, b) => b.dias_sem_treinar - a.dias_sem_treinar)
}

/** Primeiro nome, para a mensagem soar natural */
export function primeiroNome(nome: string): string {
  return nome.split(' ')[0]
}

/** Grade do mês: null para os dias vazios antes do dia 1 (semana começa no domingo) */
export function gradeDoMes(ano: number, mes: number): (number | null)[] {
  const primeiroDia = new Date(ano, mes, 1).getDay()
  const total = new Date(ano, mes + 1, 0).getDate()
  return [...Array.from({ length: primeiroDia }, () => null), ...Array.from({ length: total }, (_, i) => i + 1)]
}
