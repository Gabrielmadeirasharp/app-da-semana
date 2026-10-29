// Preço da festa. Os três tipos de pacote cobrem o mercado de buffet:
//   fixo        valor fechado até X convidados, excedente por pessoa
//   faixa       valor fixo por faixa de convidados (até 50, 60, 70...), excedente acima da última
//   por_pessoa  valor por adulto, criança paga uma fração, com mínimo de pessoas

export type PacoteFixo = { tipo: 'fixo'; preco: number; max_convidados: number; excedente_por_pessoa: number }
export type PacoteFaixa = { tipo: 'faixa'; faixas: { ate: number; preco: number }[]; excedente_por_pessoa: number }
export type PacotePorPessoa = { tipo: 'por_pessoa'; preco_adulto: number; fator_crianca: number; minimo_pessoas: number }
export type Pacote = (PacoteFixo | PacoteFaixa | PacotePorPessoa) & {
  id: string
  nome: string
  resumo: string
  inclui: string[]
  destaque?: string
}
export type Extra = { id: string; rotulo: string; descricao: string; preco: number; tipo: 'fixo' | 'por_convidado' }

export function precoPacote(p: Pacote, adultos: number, criancas: number): number {
  const convidados = adultos + criancas
  if (p.tipo === 'fixo') {
    return p.preco + Math.max(0, convidados - p.max_convidados) * p.excedente_por_pessoa
  }
  if (p.tipo === 'faixa') {
    const faixas = [...p.faixas].sort((a, b) => a.ate - b.ate)
    const faixa = faixas.find((f) => convidados <= f.ate)
    if (faixa) return faixa.preco
    const ultima = faixas[faixas.length - 1]
    return ultima.preco + (convidados - ultima.ate) * p.excedente_por_pessoa
  }
  // por pessoa: crianças pagam fração; abaixo do mínimo de pessoas, cobra o mínimo como adultos
  if (convidados < p.minimo_pessoas) return p.minimo_pessoas * p.preco_adulto
  return adultos * p.preco_adulto + criancas * p.preco_adulto * p.fator_crianca
}

export function precoExtra(x: Extra, convidados: number): number {
  return x.tipo === 'por_convidado' ? x.preco * convidados : x.preco
}

export type Orcamento = {
  convidados: number
  pacote: number
  extras: { rotulo: string; valor: number }[]
  total: number
}

export function orcar(p: Pacote, adultos: number, criancas: number, extras: Extra[], escolhidos: string[]): Orcamento {
  const convidados = adultos + criancas
  const lista = extras.filter((x) => escolhidos.includes(x.id)).map((x) => ({ rotulo: x.rotulo, valor: precoExtra(x, convidados) }))
  const pacote = precoPacote(p, adultos, criancas)
  return { convidados, pacote, extras: lista, total: pacote + lista.reduce((s, x) => s + x.valor, 0) }
}

/** Data "concorrida": está na lista de datas cheias ou cai num dia da semana disputado (ex.: sábado) */
export function dataConcorrida(iso: string, cfg: { dias_semana: number[]; datas: string[] }): boolean {
  if (!iso) return false
  const dia = new Date(iso + 'T12:00:00').getDay()
  return cfg.datas.includes(iso) || cfg.dias_semana.includes(dia)
}
