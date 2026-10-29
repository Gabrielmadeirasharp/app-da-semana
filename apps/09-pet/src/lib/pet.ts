// Regras do banho e tosa: preço por porte, horários livres, pacote e próximo banho. Funções puras.

export type Porte = 'pequeno' | 'medio' | 'grande'
export type Pet = { id: string; nome: string; artigo: string; raca: string; porte: Porte; idade: string; obs: string; cor: string; orelha: string }
export type Servico = { id: string; nome: string; descricao: string; duracao: string; precos: Record<Porte, number> }

export function precoServico(s: Servico, porte: Porte): number {
  return s.precos[porte]
}

/** AAAA-MM-DD sem fuso (meio-dia local) */
export function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function deIso(texto: string): Date {
  return new Date(texto + 'T12:00:00')
}

/** Próximos dias de atendimento a partir de amanhã (pula domingo se fechar) */
export function diasDeAtendimento(hoje: Date, quantidade: number, fechaDomingo: boolean): string[] {
  const dias: string[] = []
  const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 12)
  while (dias.length < quantidade) {
    d.setDate(d.getDate() + 1)
    if (fechaDomingo && d.getDay() === 0) continue
    dias.push(iso(d))
  }
  return dias
}

/** Horários já ocupados são simulados (sempre os mesmos para a mesma data) */
export function horarioOcupado(dia: string, hora: string): boolean {
  let h = 0
  for (const c of dia + hora) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h % 3 === 0
}

export function proximoBanho(ultimo: string, frequenciaDias: number): string {
  const d = deIso(ultimo)
  d.setDate(d.getDate() + frequenciaDias)
  return iso(d)
}

export function restantesNoPacote(usados: number, total: number): number {
  return Math.max(0, total - usados)
}
